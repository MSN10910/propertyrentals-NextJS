"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import profileDefault from "@/assets/images/profile.png";
import Spinner from "@/components/Spinner";
import { toast } from "react-toastify";

const ProfilePage = () => {
  const { data: session } = useSession();
  const profileImage = session?.user?.image;
  const profileName = session?.user?.name;
  const profileEmail = session?.user?.email;

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProperties = async (userId) => {
      if (!userId) {
        return;
      }
      try {
        const res = await fetch(`/api/properties/user/${userId}`);
        if (res.status === 200) {
          const data = await res.json();
          setProperties(data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    // Fetch user properties when session is available
    if (session?.user?.id) {
      fetchUserProperties(session.user.id);
    }
  }, [session]);

  const handleDeleteProperty = async (propertyId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });

      if (res.status === 200) {
        // Remove the property from state
        const updatedProperties = properties.filter(
          (property) => property._id !== propertyId
        );

        setProperties(updatedProperties);

        toast.success("Property Deleted");
      } else {
        toast.error("Failed to delete property");
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete property");
    }
  };

  return (
    <section class="bg-blue-50">
      <div class="container m-auto py-24">
        <div class="bg-white px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">
          <h1 class="text-3xl font-bold mb-4">Your Profile</h1>
          <div class="flex flex-col md:flex-row">
            <div class="md:w-1/4 mx-20 mt-10">
              <div class="mb-4">
                <Image
                  class="h-32 w-32 md:h-48 md:w-48 rounded-full mx-auto md:mx-0"
                  src={profileImage || profileDefault}
                  width={200}
                  height={200}
                  alt="User"
                />
              </div>
              <h2 class="text-2xl mb-4">
                <span class="font-bold block">Name: </span> {profileName}
              </h2>
              <h2 class="text-2xl">
                <span class="font-bold block">Email: </span> {profileEmail}
              </h2>
            </div>

            <div class="md:w-3/4 md:pl-4">
              <h2 class="text-xl font-semibold mb-4"></h2>
              {!loading && properties.length === 0 && (
                <p>You have no properties Listings</p>
              )}
              {loading ? (
                <Spinner loading={loading} />
              ) : (
                properties.map((property) => (
                  <div key={property._Id} class="mb-10">
                    <Link href={`/properties/${property._Id}`}>
                      <Image
                        class="h-32 w-full rounded-md object-cover"
                        src={property.images[0]}
                        width={500}
                        height={100}
                        priority={true}
                        alt="Property 1"
                      />
                    </Link>
                    <div class="mt-2">
                      <p class="text-lg font-semibold">{property.name}</p>
                      <p class="text-gray-600">
                        Address: {property.location.street}{" "}
                        {property.location.city} {property.location.state}{" "}
                      </p>
                    </div>
                    <div class="mt-2">
                      <Link
                        href={`/properties/${property._id}/edit`}
                        class="bg-blue-500 text-white px-3 py-3 rounded-md mr-2 hover:bg-blue-600"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDeleteProperty(property._id)}
                        class="bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600"
                        type="button"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
