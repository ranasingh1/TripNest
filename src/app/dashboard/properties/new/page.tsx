"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Plus, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const AMENITY_OPTIONS = [
  "WiFi",
  "Pool",
  "Kitchen",
  "Air Conditioning",
  "Heating",
  "Washer",
  "Dryer",
  "TV",
  "Parking",
  "Elevator",
  "Beach Access",
  "Mountain View",
  "Ocean View",
  "Balcony",
  "Fireplace",
  "Hot Tub",
  "BBQ Grill",
  "Gym",
  "Security System",
  "Coffee Maker",
  "Dishwasher",
  "Microwave",
];

export default function NewPropertyPage() {
  const router = useRouter();

  // Form state
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Basic Info
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [beds, setBeds] = useState("");
  const [baths, setBaths] = useState("");
  const [guests, setGuests] = useState("");

  // Amenities
  const [amenities, setAmenities] = useState<string[]>([]);

  // Images
  const [images, setImages] = useState<{ file?: File; preview: string }[]>([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: number]: number }>({});

  // Host Info
  const [hostName, setHostName] = useState("");
  const [hostImage, setHostImage] = useState<{ file?: File; preview: string } | null>(null);
  const [responseRate, setResponseRate] = useState("");
  const [responseTime, setResponseTime] = useState("");
  const [joined, setJoined] = useState("");

  // House Rules
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [allowPets, setAllowPets] = useState(false);
  const [allowSmoking, setAllowSmoking] = useState(false);
  const [allowParties, setAllowParties] = useState(false);

  // Location Details
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  // Inventory (Blocked Dates for bookings)
  const [blockedDates, setBlockedDates] = useState<Date[]>([]);

  // Handlers for Images
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);
    const newImages = filesArray.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  // Host Image Handlers
  const handleHostImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setHostImage({ file, preview: URL.createObjectURL(file) });
    }
  };

  const handleRemoveHostImage = () => {
    if (hostImage?.preview) {
      URL.revokeObjectURL(hostImage.preview);
    }
    setHostImage(null);
  };

  // Amenities toggle handler
  const handleAmenityToggle = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  // Inventory (Blocked Dates) handler using react-calendar's onClickDay
  const handleDayClick = (date: Date) => {
    if (blockedDates.some((d) => d.toDateString() === date.toDateString())) {
      setBlockedDates(blockedDates.filter((d) => d.toDateString() !== date.toDateString()));
    } else {
      setBlockedDates([...blockedDates, date]);
    }
  };

  // Cloudinary upload function (memoized)
  const uploadToCloudinary = useCallback(
    (file: File, index?: number): Promise<string> => {
      return new Promise<string>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

        xhr.open(
          "POST",
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
        );

        if (typeof index === "number") {
          xhr.upload.addEventListener("progress", (event) => {
            if (event.lengthComputable) {
              const percent = (event.loaded / event.total) * 100;
              setUploadProgress((prev) => ({ ...prev, [index]: percent }));
            }
          });
        }

        xhr.onload = () => {
          if (xhr.status === 200) {
            const res = JSON.parse(xhr.responseText);
            resolve(res.secure_url);
          } else {
            reject(new Error("Upload failed"));
          }
        };

        xhr.onerror = () => reject(new Error("Upload error"));
        xhr.send(formData);
      });
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (!title || !description || !location || !price) {
      setError("Please fill in all required fields");
      setActiveTab("basic");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");

      // Upload property images
      const validImages = images.filter((img) => img.file);
      const propertyImages = await Promise.all(
        validImages.map((img, index) => uploadToCloudinary(img.file!, index))
      );

      // Upload host image if available
      let hostImageUrl = "/placeholder.svg";
      if (hostImage?.file) {
        hostImageUrl = await uploadToCloudinary(hostImage.file);
      }

      const propertyData = {
        title,
        description,
        location,
        price: Number(price),
        rating: 0,
        reviews: 0,
        images: propertyImages,
        beds: Number(beds || 0),
        baths: Number(baths || 0),
        guests: Number(guests || 0),
        amenities,
        isSuperhost: false,
        isNewListing: true,
        discount: 0,
        availability: "High availability",
        host: {
          name: hostName,
          image: hostImageUrl,
          responseRate: Number(responseRate || 95),
          responseTime: responseTime || "within a day",
          joined:
            joined ||
            new Date().toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            }),
        },
        rules: {
          checkIn: checkIn || "3:00 PM",
          checkOut: checkOut || "11:00 AM",
          pets: allowPets,
          smoking: allowSmoking,
          parties: allowParties,
        },
        location_details: {
          address: address || location,
          coordinates: {
            lat: Number(latitude || 0),
            lng: Number(longitude || 0),
          },
        },
        inventory: blockedDates,
      };

      const res = await fetch("/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(propertyData),
      });

      if (!res.ok) {
        throw new Error("Failed to create property");
      }

      setSuccess("Property created successfully!");
      setTimeout(() => router.push("/dashboard/properties"), 2000);
    } catch (err) {
      console.error("Error creating property:", err);
      setError("Failed to create property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Add New Property</h1>
        <p className="text-gray-500">
          Create a new listing for your vacation rental property
        </p>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8 grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="host">Host & Rules</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>

          {/* Basic Information */}
          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Property Title <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g. Luxury Villa with Ocean View"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your property..."
                    className="min-h-32"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">
                    Location <span className="text-red-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                    <Input
                      id="location"
                      placeholder="e.g. Bali, Indonesia"
                      className="pl-10"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">
                      Price per Night ($) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      placeholder="e.g. 250"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="beds">Beds</Label>
                    <Input
                      id="beds"
                      type="number"
                      placeholder="e.g. 2"
                      value={beds}
                      onChange={(e) => setBeds(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="baths">Baths</Label>
                    <Input
                      id="baths"
                      type="number"
                      placeholder="e.g. 2"
                      value={baths}
                      onChange={(e) => setBaths(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guests">Max Guests</Label>
                    <Input
                      id="guests"
                      type="number"
                      placeholder="e.g. 4"
                      value={guests}
                      onChange={(e) => setGuests(e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    onClick={() => setActiveTab("amenities")}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    Next: Amenities
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Amenities */}
          <TabsContent value="amenities">
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {AMENITY_OPTIONS.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={`amenity-${amenity}`}
                        checked={amenities.includes(amenity)}
                        onCheckedChange={() => handleAmenityToggle(amenity)}
                      />
                      <Label htmlFor={`amenity-${amenity}`}>{amenity}</Label>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("basic")}>
                    Back: Basic Info
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("images")}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    Next: Images
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Images */}
          <TabsContent value="images">
            <Card>
              <CardHeader>
                <CardTitle>Property Images</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <Label className="block mb-2">Upload Property Photos</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                    {images.map((image, index) => (
                      <div key={index} className="relative rounded-md overflow-hidden h-40 bg-gray-100">
                        <img
                          src={image.preview || "/placeholder.svg"}
                          alt={`Property ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {uploadProgress[index] !== undefined && uploadProgress[index] < 100 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <div className="text-white font-medium">{Math.round(uploadProgress[index])}%</div>
                          </div>
                        )}
                        <button
                          type="button"
                          className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                          onClick={() => handleRemoveImage(index)}
                        >
                          <X className="h-4 w-4 text-gray-600" />
                        </button>
                      </div>
                    ))}
                    <label className="flex flex-col items-center justify-center h-40 border-2 border-dashed border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer">
                      <Upload className="h-8 w-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Upload Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  <p className="text-sm text-gray-500">
                    Upload high-quality images of your property. You can add up to 10 images.
                  </p>
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("amenities")}>
                    Back: Amenities
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("host")} className="bg-teal-600 hover:bg-teal-700">
                    Next: Host & Rules
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Host & Rules */}
          <TabsContent value="host">
            <Card>
              <CardHeader>
                <CardTitle>Host Information & House Rules</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Host Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="hostName">Host Name</Label>
                        <Input
                          id="hostName"
                          placeholder="e.g. John Smith"
                          value={hostName}
                          onChange={(e) => setHostName(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="responseRate">Response Rate (%)</Label>
                        <Input
                          id="responseRate"
                          type="number"
                          placeholder="e.g. 95"
                          value={responseRate}
                          onChange={(e) => setResponseRate(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="responseTime">Response Time</Label>
                        <Input
                          id="responseTime"
                          placeholder="e.g. within an hour"
                          value={responseTime}
                          onChange={(e) => setResponseTime(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="joined">Joined Since</Label>
                        <Input
                          id="joined"
                          placeholder="e.g. January 2023"
                          value={joined}
                          onChange={(e) => setJoined(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Host Profile Image</Label>
                      <div className="flex items-center gap-4">
                        {hostImage ? (
                          <div className="relative h-16 w-16 rounded-full overflow-hidden">
                            <img
                              src={hostImage.preview || "/placeholder.svg"}
                              alt="Host"
                              className="w-full h-full object-cover"
                            />
                            <button
                              type="button"
                              className="absolute top-0 right-0 bg-white rounded-full p-1 shadow-md hover:bg-gray-100"
                              onClick={handleRemoveHostImage}
                            >
                              <X className="h-3 w-3 text-gray-600" />
                            </button>
                          </div>
                        ) : (
                          <label className="flex items-center justify-center h-16 w-16 rounded-full border-2 border-dashed border-gray-300 hover:bg-gray-50 transition-colors cursor-pointer">
                            <Plus className="h-6 w-6 text-gray-400" />
                            <input type="file" accept="image/*" className="hidden" onChange={handleHostImageUpload} />
                          </label>
                        )}
                        <div className="text-sm text-gray-500">Upload a profile image for the host</div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">House Rules</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="checkIn">Check-in Time</Label>
                        <Input
                          id="checkIn"
                          placeholder="e.g. 3:00 PM"
                          value={checkIn}
                          onChange={(e) => setCheckIn(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="checkOut">Check-out Time</Label>
                        <Input
                          id="checkOut"
                          placeholder="e.g. 11:00 AM"
                          value={checkOut}
                          onChange={(e) => setCheckOut(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Allowed Activities</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="allowPets"
                            checked={allowPets}
                            onCheckedChange={(checked: boolean) => setAllowPets(checked)}
                          />
                          <Label htmlFor="allowPets">Pets Allowed</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="allowSmoking"
                            checked={allowSmoking}
                            onCheckedChange={(checked: boolean) => setAllowSmoking(checked)}
                          />
                          <Label htmlFor="allowSmoking">Smoking Allowed</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="allowParties"
                            checked={allowParties}
                            onCheckedChange={(checked: boolean) => setAllowParties(checked)}
                          />
                          <Label htmlFor="allowParties">Parties Allowed</Label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h3 className="font-medium">Location Details</h3>
                    <div className="space-y-2">
                      <Label htmlFor="address">Full Address</Label>
                      <Input
                        id="address"
                        placeholder="Enter the complete address"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Latitude</Label>
                        <Input
                          id="latitude"
                          placeholder="e.g. 40.7128"
                          value={latitude}
                          onChange={(e) => setLatitude(e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">Longitude</Label>
                        <Input
                          id="longitude"
                          placeholder="e.g. -74.0060"
                          value={longitude}
                          onChange={(e) => setLongitude(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between mt-6">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("images")}>
                    Back: Images
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setActiveTab("availability")}
                    className="bg-teal-600 hover:bg-teal-700"
                  >
                    Next: Availability
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Availability */}
          <TabsContent value="availability">
            <Card>
              <CardHeader>
                <CardTitle>Availability Calendar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 mb-6">
                  <p className="text-gray-500">
                    Select dates when your property is not available (inventory management).
                  </p>
                  <div className="border rounded-md p-4">
                    <Calendar
                      onClickDay={handleDayClick}
                      tileClassName={({ date, view }: { date: Date; view: string }) => {
                        if (
                          view === "month" &&
                          blockedDates.some(
                            (d) => d.toDateString() === date.toDateString()
                          )
                        ) {
                          return "bg-gray-300";
                        }
                      }}
                      showDoubleView={true}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">
                      Blocked Dates: {blockedDates.length}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {blockedDates.slice(0, 5).map((date, index) => (
                        <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                          {date.toLocaleDateString()}
                          <button
                            type="button"
                            className="ml-2 text-gray-500 hover:text-gray-700"
                            onClick={() =>
                              setBlockedDates(blockedDates.filter((_, i) => i !== index))
                            }
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {blockedDates.length > 5 && (
                        <div className="bg-gray-100 rounded-full px-3 py-1 text-sm">
                          +{blockedDates.length - 5} more
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("host")}>
                    Back: Host & Rules
                  </Button>
                  <Button type="submit" className="bg-teal-600 hover:bg-teal-700" disabled={isSubmitting}>
                    {isSubmitting ? "Creating Property..." : "Create Property"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
