import { MapPin } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

export default function ListingCard({ listing }) {
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full sm:w-[300px]">
      <Link to={`/listing/${listing._id}`}>
        <img
          src={
            listing.imageUrls[0] ||
            "https://d9twfl9s6jzl9.cloudfront.net/wp-content/uploads/2021/03/18111937/property-default-image.jpg"
          }
          alt="Listing Cover Image"
          className="h-[260px] sm:h-[200px] w-full object-cover hover:scale-105 transition-transform duration-300"
        />
        <div className="p-3 flex flex-col gap-2 w-full">
          <p className="truncate text-base sm:text-lg font-semibold text-slate-700">
            {listing.name}
          </p>
          <div className="flex items-center gap-1">
            <MapPin className="text-green-700 h-4 w-4" />
            <p className="text-sm text-gray-600 truncate w-full">
              {listing.address}
            </p>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">
            {listing.description}
          </p>
          <p className="text-slate-500 mt-2 font-semibold flex items-center text-sm">
            ${listing.offer ? listing.discountPrice : listing.regularPrice}
            {listing.type === "rent" && "/ month"}
          </p>

          <div className="flex gap-4 text-slate-700">
            <div>
              <p className="font-bold text-xs">
                {listing.bedrooms > 1
                  ? `${listing.bedrooms} beds`
                  : `${listing.bedrooms} bed`}
              </p>
            </div>
            <div>
              <p className="font-bold text-xs">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} baths`
                  : `${listing.bathrooms} bath`}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
