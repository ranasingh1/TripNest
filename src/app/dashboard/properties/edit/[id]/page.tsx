"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, X, Plus, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

export default function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const { id } = resolvedParams;

  const router = useRouter();

  // General state
  const [activeTab, setActiveTab] = useState("basic");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(true);

  // Basic Information
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
  const [images, setImages] = useState<
    { file?: File; preview: string; url?: string }[]
  >([]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: number]: number }>({});

  // Host Information
  const [hostName, setHostName] = useState("");
  const [hostImage, setHostImage] = useState<{ file?: File; preview: string; url?: string } | null>(null);
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

  // Availability
  const [inventory, setinventory] = useState<Date[]>([]);

  // ----------------------------------------------------------------------------
  // Fetch property data
  // ----------------------------------------------------------------------------
  useEffect(() => {
    async function fetchProperty() {
      try {
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) throw new Error("Failed to load property data");
        const data = await res.json();

        // Basic Info
        setTitle(data.title || "");
        setDescription(data.description || "");
        setLocation(data.location || "");
        setPrice(data.price ? data.price.toString() : "");
        setBeds(data.beds ? data.beds.toString() : "");
        setBaths(data.baths ? data.baths.toString() : "");
        setGuests(data.guests ? data.guests.toString() : "");

        // Amenities
        setAmenities(data.amenities || []);
        console.log(data.Images, "Images");
        
        // Images (assumed as an array of image URLs)
        if (data.images && Array.isArray(data.images)) {
          const formattedImages = data.images.map((url: string) => ({
            preview: url,
            url,
          }));
          setImages(formattedImages);
        }

        // Host Information
        if (data.host) {
          setHostName(data.host.name || "");
          setResponseRate(data.host.responseRate ? data.host.responseRate.toString() : "");
          setResponseTime(data.host.responseTime || "");
          setJoined(data.host.joined || "");
          setHostImage({
            preview: data.host.image || "/placeholder.svg",
            url: data.host.image || "/placeholder.svg",
          });
        }

        // House Rules
        if (data.rules) {
          setCheckIn(data.rules.checkIn || "");
          setCheckOut(data.rules.checkOut || "");
          setAllowPets(data.rules.pets || false);
          setAllowSmoking(data.rules.smoking || false);
          setAllowParties(data.rules.parties || false);
        }

        // Location Details
        if (data.location_details) {
          setAddress(data.location_details.address || "");
          setLatitude(
            data.location_details.coordinates?.lat
              ? data.location_details.coordinates.lat.toString()
              : ""
          );
          setLongitude(
            data.location_details.coordinates?.lng
              ? data.location_details.coordinates.lng.toString()
              : ""
          );
        }

        // Blocked Dates
        if (data.inventory && Array.isArray(data.inventory)) {
          setinventory(data?.inventory.map((date: string) => new Date(date)));
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load property data.");
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [id]);

  // ----------------------------------------------------------------------------
  // Cloudinary Upload Function
  // ----------------------------------------------------------------------------
  const uploadToCloudinary = async (file: File, index: number) => {
    return new Promise<string>((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
      );

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const percent = (event.loaded / event.total) * 100;
          setUploadProgress((prev) => ({ ...prev, [index]: percent }));
        }
      });

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
  };

  // ----------------------------------------------------------------------------
  // Event Handlers
  // ----------------------------------------------------------------------------

  // Handle multiple property images upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newImages = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        url: undefined,
      }));
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  // Remove a property image by index
  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const updated = [...prev];
      if (updated[index].file) {
        URL.revokeObjectURL(updated[index].preview);
      }
      updated.splice(index, 1);
      return updated;
    });
  };

  // Handle host image upload (only one image)
  const handleHostImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setHostImage({ file, preview: URL.createObjectURL(file), url: undefined });
    }
  };

  // Remove host image
  const handleRemoveHostImage = () => {
    if (hostImage?.file) {
      URL.revokeObjectURL(hostImage.preview);
    }
    setHostImage(null);
  };

  // Toggle amenity selection
  const handleAmenityToggle = (amenity: string) => {
    setAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  // Toggle blocked date selection
  const handleDateSelect = (dates: Date[] | undefined) => {
    if (!dates) return;
    setinventory(dates);
  };

  // ----------------------------------------------------------------------------
  // Form Submission
  // ----------------------------------------------------------------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    try {
      if (!title || !description || !location || !price) {
        setError("Please fill in all required fields");
        setActiveTab("basic");
        setIsSubmitting(false);
        return;
      }

      // Upload new property images
      const propertyImages = await Promise.all(
        images.map((img, index) =>
          img.file ? uploadToCloudinary(img.file, index) : img.url || ""
        )
      );

      // Upload host image if it is a new file
      let hostImageUrl = hostImage?.url || "/placeholder.svg";
      if (hostImage?.file) {
        hostImageUrl = await uploadToCloudinary(hostImage.file, images.length);
      }

      const propertyData = {
        id,
        title,
        description,
        location,
        price: Number(price),
        images: propertyImages,
        beds: Number(beds || 0),
        baths: Number(baths || 0),
        guests: Number(guests || 0),
        amenities,
        host: {
          name: hostName,
          image: hostImageUrl,
          responseRate: Number(responseRate || 95),
          responseTime: responseTime || "within a day",
          joined:
            joined ||
            new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" }),
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
        inventory,
      };

      const res = await fetch(`/api/properties/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(propertyData),
      });

      if (!res.ok) throw new Error("Failed to update property");

      setSuccess("Property updated successfully!");
      setTimeout(() => router.push("/dashboard/properties"), 2000);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to update property. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ----------------------------------------------------------------------------
  // Render Loading Skeleton or Form
  // ----------------------------------------------------------------------------
  if (loading) {
    return (
      <div className="p-6 lg:p-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>

        <Tabs defaultValue="basic">
          <TabsList className="mb-8 grid grid-cols-2 md:grid-cols-5 w-full">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="amenities">Amenities</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="host">Host & Rules</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
          </TabsList>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32 mb-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Edit Property</h1>
        <p className="text-gray-500">Update your property listing information</p>
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
                  {[
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
                  ].map((amenity) => (
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
                  <Label className="block mb-2">Property Photos</Label>
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
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} />
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
                            onCheckedChange={(checked) => setAllowPets(checked === true)}
                          />
                          <Label htmlFor="allowPets">Pets Allowed</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="allowSmoking"
                            checked={allowSmoking}
                            onCheckedChange={(checked) => setAllowSmoking(checked === true)}
                          />
                          <Label htmlFor="allowSmoking">Smoking Allowed</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="allowParties"
                            checked={allowParties}
                            onCheckedChange={(checked) => setAllowParties(checked === true)}
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
                    Select dates when your property is not available for booking.
                  </p>
                  <div className="border rounded-md p-4">
                    <Calendar
                      mode="multiple"
                      selected={inventory}
                      onSelect={handleDateSelect}
                      className="rounded-md border"
                      numberOfMonths={2}
                    />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Blocked Dates: {inventory.length}</h3>
                    <div className="flex flex-wrap gap-2">
                      {inventory.slice(0, 5).map((date, index) => (
                        <div key={index} className="flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                          {date.toLocaleDateString()}
                          <button
                            type="button"
                            className="ml-2 text-gray-500 hover:text-gray-700"
                            onClick={() =>
                              setinventory(inventory.filter((_, i) => i !== index))
                            }
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                      {inventory.length > 5 && (
                        <div className="bg-gray-100 rounded-full px-3 py-1 text-sm">
                          +{inventory.length - 5} more
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
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating Property...
                      </>
                    ) : (
                      "Update Property"
                    )}
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
