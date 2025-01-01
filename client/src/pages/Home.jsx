import React, { useEffect, useState } from "react";
import backgroundImage from "../assets/img/backGround.png";
import { Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard";

export default function Home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);

    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };



  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        const res = await fetch("/api/listing/get?offer=true&limit=4");
        const data = await res.json();
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.log(error);
      }
    };
    const fetchRentListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=rent&limit=4");
        const data = await res.json();
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.log(error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        const res = await fetch("/api/listing/get?type=sale&limit=4");
        const data = await res.json();
        setSaleListings(data);
      } catch (error) {
        log(error);
      }
    };
    fetchOfferListings();
  }, []);

  return (
    <div className="mt-16">
      {/* Top */}

      <div className="px-40 flex flex-1 justify-center py-5">
        <div className="layout-content-container flex flex-col max-w-6xl flex-1">
          <div
            className="md:pl-20 mb-5 flex min-h-[480px] flex-col gap-6 bg-cover bg-center bg-no-repeat items-start justify-end px-4 pb-10 rounded-xl"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%), url("https://cdn.usegalileo.ai/sdxl10/4014b387-a46c-412d-ab2c-12666d557457.png")`,
            }}
          >
            <h1 className="text-white text-4xl font-black leading-tight tracking-[-0.033em] text-center">
              Find the perfect place to call home
            </h1>

            <div className="flex bg-white p-2 rounded-lg w-[400px] gap-3 mb-16 items-center">
              <Search className="text-[#c0c3c9]" />
              <input
                placeholder="Search for your future home"
                className="text-black placeholder-[#bcb6b0] w-full text-sm outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <form onSubmit={handleSubmit}>
                <button className="bg-slate-700 px-2 py-1 rounded-lg text-white font-semibold hover:cursor-pointer">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Offers */}

      <div className="mx-auto">
        <div className="max-w-6xl mx-auto p-3 flex flex-col gap-3">
          {offerListings && offerListings.length > 0 && (
            <div className="">
              <div className="">
                <h2 className="text-2xl font-semibold text-slate-600">
                  Recent offers
                </h2>
                <Link
                  className="text-sm text-blue-800 hover:underline"
                  to={"/search?offer=true"}
                >
                  Show more offers
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {offerListings.map((listing) => (
                  <ListingCard listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="max-w-6xl mx-auto p-3 flex flex-col gap-3 mt-5">
          {saleListings && saleListings.length > 0 && (
            <div className="">
              <div className="">
                <h2 className="text-2xl font-semibold text-slate-600">
                  For Sale
                </h2>
                <Link
                  className="text-sm text-blue-800 hover:underline"
                  to={"/search?type=sale"}
                >
                  Show more sale listings
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {saleListings.map((listing) => (
                  <ListingCard listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-5 max-w-6xl mx-auto p-3 flex flex-col gap-3">
          {rentListings && rentListings.length > 0 && (
            <div className="">
              <div className="">
                <h2 className="text-2xl font-semibold text-slate-600">
                  For Rent
                </h2>
                <Link
                  className="text-sm text-blue-800 hover:underline"
                  to={"/search?type=rent"}
                >
                  Show more rent listings
                </Link>
              </div>
              <div className="flex flex-wrap gap-4">
                {rentListings.map((listing) => (
                  <ListingCard listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="bg-gray-900 text-gray-300 text-center py-6 mt-10 shadow-lg">
        <div className="max-w-6xl mx-auto px-4 flex flex-col items-center">
          <p className="text-lg font-semibold">Created by Om Patel</p>
          <div className="flex gap-4 mt-2">
            <a
              href="https://github.com/Om-1004"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition"
            >
              GitHub
            </a>
            <a
              href="https://www.linkedin.com/in/om-patel-889817261/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition"
            >
              LinkedIn
            </a>
            <a
              href="mailto:opatel101004@gmail.com"
              className="text-gray-300 hover:text-white transition"
            >
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
