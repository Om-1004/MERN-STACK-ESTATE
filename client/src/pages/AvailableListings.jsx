import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ListingCard from "../components/ListingCard";

export default function AvailableListings() {
  const [searchField, setSearchField] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarData, setSidebarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "created_at",
    order: "desc",
  });
  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc",
      });
    }

    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false)
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/listing/get?${searchQuery}`);
      const data = await res.json();
      if (data.length > 8) {
        setShowMore(true);
      } else {
        setShowMore(false)
      }
      setListings(data);
      setLoading(false);
    };
    fetchListings();
  }, [location.search]);

  const handleChange = (e) => {
    if (
      e.target.id === "all" ||
      e.target.id === "rent" ||
      e.target.id === "sale"
    ) {
      setSidebarData({ ...sidebarData, type: e.target.id });
    }
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (
      e.target.id === "parking" ||
      e.target.id === "furnished" ||
      e.target.id === "offer"
    ) {
      setSidebarData({
        ...sidebarData,
        [e.target.id]:
          e.target.checked || e.target.checked === "true" ? true : false,
      });
    }
    if (e.target.id === "sort_order") {
      const sort = e.target.value.split("_")[0] || "created_at";
      const order = e.target.value.split("_")[1] || "desc";
      setSidebarData({ ...sidebarData, sort, order });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const urlParams = new URLSearchParams();
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("type", sidebarData.type);
    urlParams.set("parking", sidebarData.parking);
    urlParams.set("furnished", sidebarData.furnished);
    urlParams.set("offer", sidebarData.offer);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("order", sidebarData.order);
    const searchQuery = urlParams.toString();

    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col md:flex-row  max-w-7xl gap-10 mx-auto">
        {/* Left Part */}

        <div className="border mt-5 p-2 rounded-lg w-full md:w-1/3 mx-auto md:mx-0">
          <div className="flex gap-4 w-100px md:w-[280px] bg-[#e7edf2] p-2 rounded-lg mx-auto md:mx-0">
            <Search />
            <input
              type="text"
              placeholder="Search for a property"
              className="bg-transparent bg-slate-700"
              id="searchTerm"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          <h2 className="font-extrabold text-xl mt-5 text-center md:text-left">
            Property Type
          </h2>
          <div className="border mt-5 mx-auto md:mx-0 rounded-md p-4 flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-3">
            <input
              type="checkbox"
              className="form-radio h-5 w-5 text-blue-500 mt-1 md:mt-0 mx-auto md:mx-0"
              id="all"
              onChange={handleChange}
              checked={sidebarData.type === "all"}
            />
            <div className="mx-auto md:mx-0">
              <h4 className="text-sm font-medium text-gray-900">Rent & Sale</h4>
            </div>
          </div>

          <div className="border mt-5 mx-auto md:mx-0 rounded-md p-4 flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-3">
            <input
              type="checkbox"
              className="form-radio h-5 w-5 text-blue-500 mt-1 md:mt-0 mx-auto md:mx-0"
              id="rent"
              onChange={handleChange}
              checked={sidebarData.type === "rent"}
            />
            <div className="mx-auto md:mx-0">
              <h4 className="text-sm font-medium text-gray-900">Rent</h4>
            </div>
          </div>

          <div className="border mt-5 mx-auto md:mx-0 rounded-md p-4 flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-3">
            <input
              type="checkbox"
              className="form-radio h-5 w-5 text-blue-500 mt-1 md:mt-0 mx-auto md:mx-0"
              id="sale"
              onChange={handleChange}
              checked={sidebarData.type === "sale"}
            />
            <div className="mx-auto md:mx-0">
              <h4 className="text-sm font-medium text-gray-900">Sale</h4>
            </div>
          </div>

          <div className="border mt-5 mx-auto md:mx-0 rounded-md p-4 flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-3">
            <input
              type="checkbox"
              className="form-radio h-5 w-5 text-blue-500 mt-1 md:mt-0 mx-auto md:mx-0"
              id="offer"
              onChange={handleChange}
              checked={sidebarData.offer}
            />
            <div className="mx-auto md:mx-0">
              <h4 className="text-sm font-medium text-gray-900">Offer</h4>
            </div>
          </div>

          <h2 className="font-extrabold text-xl mt-7 text-center md:text-left">
            Amenities
          </h2>

          <div className="border mt-5 mx-auto md:mx-0 rounded-md p-4 flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-3">
            <input
              type="checkbox"
              className="form-radio h-5 w-5 text-blue-500 mt-1 md:mt-0 mx-auto md:mx-0"
              id="parking"
              onChange={handleChange}
              checked={sidebarData.parking}
            />
            <div className="mx-auto md:mx-0">
              <h4 className="text-sm font-medium text-gray-900">Parking</h4>
            </div>
          </div>

          <div className="border mt-5 mx-auto md:mx-0 rounded-md p-4 flex flex-col md:flex-row items-start md:items-center space-y-3 md:space-y-0 md:space-x-3">
            <input
              type="checkbox"
              className="form-radio h-5 w-5 text-blue-500 mt-1 md:mt-0 mx-auto md:mx-0"
              id="furnished"
              onChange={handleChange}
              checked={sidebarData.furnished}
            />
            <div className="mx-auto md:mx-0">
              <h4 className="text-sm font-medium text-gray-900">Furnished</h4>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-5">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              defaultChecked={"created_at_desc"}
              id="sort_order"
              className="border rounded-lg p-3"
            >
              <option value="regularPrice_desc">Price high to low</option>
              <option value="regularPrice_asc">Price low to high</option>
              <option value="createdAt_desc">Latest</option>
              <option value="createdAt_asc">Oldest</option>
            </select>
          </div>
          <button className=" mt-12 p-2 bg-[#3c82f5] rounded-lg text-white text-center w-[100px]">
            Search
          </button>
        </div>

        {/* Right Part */}
        <div className="mt-7 mx-auto text-center md:text-left md:mx-0 flex flex-col gap-3 ">
          <h2 className="mt-5 text-xl font-extrabold">
            Results for: {sidebarData.searchTerm}
          </h2>

          <div className="mt-3 flex flex-wrap gap-4">
            {!loading && listings.length === 0 && (
              <p className="text-xl text-slate-700">No Listings Found!</p>
            )}
            {loading && (
              <p className="text-xl text-slate-700 text-center w-full">
                Loading...
              </p>
            )}

            {!loading &&
              listings &&
              listings.map((listing) => (
                <ListingCard key={listing._id} listing={listing} />
              ))}

            {showMore && (
              <button
              type="button"
                className="text-blue-700 hover:underline p-7"
                onClick={handleShowMore}
              >
                Show More
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
