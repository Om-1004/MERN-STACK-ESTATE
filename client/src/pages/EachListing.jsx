import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore from "swiper";
import { useSelector } from "react-redux";
import { Navigation } from "swiper/modules";
import "swiper/css/bundle";
import { Share2, MapPin, Bath, Bed, Car, Armchair } from "lucide-react";
import Contact from "../components/Contact";

export default function EachListing() {
  SwiperCore.use([Navigation]);
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [copied, setCopied] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [contact, setContact] = useState(false);

  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);

        const res = await fetch(`/api/listing/get/${params.listingID}`);
        const data = await res.json();

        if (data.success === false) {
          setError(true);
          setLoading(false);
          return;
        }
        setListing(data);
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingID]);

  return (
    <main>
      {listing && !loading && !error && (
        <div className="container mt-8 mx-auto md:max-w-7xl rounded-2xl shadow-lg bg-white">
          <Swiper
            navigation
            loop
            className="rounded-2xl overflow-hidden"
            style={{
              boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          >
            {listing.imageUrls.map((url) => (
              <SwiperSlide key={url}>
                <div
                  className="h-[350px] md:h-[500px] bg-center bg-cover transition-transform hover:scale-105"
                  style={{ backgroundImage: `url(${url})` }}
                  role="img"
                  aria-label="Listing Image"
                ></div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="relative z-20">
            <div
              className="absolute w-14 h-14 top-4 right-4 flex items-center justify-center bg-white shadow-md hover:shadow-lg border border-gray-300 rounded-full transition-all duration-300 ease-in-out"
              title="Copy Link"
              aria-label="Copy Link Button"
            >
              <Share2
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                className="cursor-pointer text-gray-600 hover:text-gray-800 transition-colors duration-200 ease-in-out"
              />
            </div>

            {copied && (
              <p
                className="absolute top-[5.5rem] right-0 w-max bg-green-100 shadow-md border border-green-300 rounded-lg px-4 py-2 text-sm text-gray-700"
                role="status"
              >
                ✅ Link Copied!
              </p>
            )}
          </div>

          <div className="flex flex-col max-w-5xl mx-auto p-6 my-8 gap-6 bg-gray-50 rounded-lg shadow-sm">
            <p className="text-3xl font-semibold text-gray-800">
              {listing.name}
            </p>
            <p className="text-green-600 text-xl font-medium">
              $
              {listing.offer
                ? listing.discountPrice.toLocaleString("en-US")
                : listing.regularPrice.toLocaleString("en-US")}
              {listing.type === "rent" && " / month"}
            </p>
            <div className="flex flex-col md:flex-row gap-2">
              <button
                className="text-center bg-red-800 w-[120px] px-4 py-2 rounded-xl font-bold text-white hover:bg-red-700 transition-all duration-300 ease-in-out"
                aria-label={`Listing for ${listing.type}`}
              >
                For {listing.type}
              </button>

              {listing.offer && (
                <p className="text-center bg-green-600 w-[120px] px-4 py-2 rounded-xl font-bold text-white hover:bg-green-700 transition-all duration-300 ease-in-out">
                  ${+listing.regularPrice - +listing.discountPrice}
                </p>
              )}
            </div>

            <div className="flex col md:flex-row items-center gap-2">
              <MapPin className="text-green-600" />
              <p>{listing.address}</p>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg shadow-sm">
              <li className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <Bed className="w-6 h-6 mr-4" />
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {listing.bedrooms > 1
                      ? `${listing.bedrooms} beds `
                      : `${listing.bedrooms} bed`}
                  </p>
                </div>
              </li>
              <li className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <Bath className="w-6 h-6 mr-4" />
                <div>
                  <p className="text-lg font-semibold text-gray-800">
                    {listing.bedrooms > 1
                      ? `${listing.bathrooms} bathrooms `
                      : `${listing.bathrooms} bathroom`}
                  </p>
                </div>
              </li>
              <li className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <Car className="w-6 h-6 mr-4" />
                <div>{listing.parking ? "Parking" : "No Parking"}</div>
              </li>
              <li className="flex items-center p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                <Armchair className="w-6 h-6 mr-4" />
                <div>{listing.furnished ? "Furnished" : "Not Furnished"}</div>
              </li>
            </ul>
            {currentUser && listing.userRef !== currentUser._id && !contact && (
              <button
                onClick={() => setContact(true)}
                className="bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 p-3"
              >
                Contact landlord
              </button>
            )}
            {contact && <Contact listing={listing}/>}
          </div>
        </div>
      )}
    </main>
  );
}
