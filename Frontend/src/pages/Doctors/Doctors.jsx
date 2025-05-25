import React, { useEffect, useState } from "react";
import DoctorCard from "../../components/Doctors/DoctorCard";
import Testimonial from "../../components/Testimonial/Testimonial";
import { BASE_URL } from "../../config";
import Loader from "../../components/Loader/Loading";
import Error from "../../components/Error/Error";

const Doctors = () => {
  const [query, setQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");
  const [useNearby, setUseNearby] = useState(false);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceQuery(query.trim());
    }, 700);
    return () => clearTimeout(timeout);
  }, [query]);

  // Get user's location if "Nearby" is enabled
  useEffect(() => {
    if (useNearby) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLocation({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          });
        },
        (err) => {
          console.error("Geolocation error:", err.message);
          alert("Location access denied. Please enable it or use search instead.");
          setUseNearby(false);
        }
      );
    }
  }, [useNearby]);

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!useNearby && debounceQuery.length === 0) return;

      setLoading(true);
      setError(false);

      try {
        const response = await fetch(`${BASE_URL}/doctors/search`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            useNearby
              ? { nearby: true, lat: location.lat, lng: location.lng }
              : { name: debounceQuery }
          ),
        });

        const result = await response.json();
        if (!result.success) throw new Error("Failed to fetch");

        setDoctors(result.data);
      } catch (err) {
        setError(true);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, [debounceQuery, useNearby, location]);

  return (
    <>
      <section className="bg-[#caf0f8]">
        <div className="container text-center">
          <h2 className="heading">Find a Doctor</h2>

          <div className="max-w-[570px] mt-[30px] mx-auto bg-[#f5f9fa] rounded-lg flex items-center justify-between p-2 border-2 border-gray-300 hover:border-black">
            <input
              type="search"
              className="py-2 bg-transparent w-2/3 focus:outline-none text-[18px] cursor-pointer placeholder:text-textColor"
              placeholder="Search doctor by name or specialization"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setUseNearby(false);
              }}
              disabled={useNearby}
            />

            <button
              className="btn mt-0 mb-0 py-[10px] mr-1 rounded-lg"
              onClick={() => setUseNearby(false)}
              disabled={!useNearby && query.trim().length === 0}
            >
              Search
            </button>

            <button
              className="btn mt-0 mb-0 py-[10px] ml-1 rounded-lg"
              onClick={() => {
                setUseNearby(true);
                setQuery("");
              }}
              disabled={useNearby}
            >
              Nearby
            </button>
          </div>
        </div>
      </section>

      <section>
        <div className="container">
          {loading && <Loader />}
          {error && <Error />}
          {!loading && !error && doctors?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
              {doctors.map((doctor) => (
                <DoctorCard key={doctor._id} doctor={doctor} />
              ))}
            </div>
          )}
          {!loading && !error && doctors?.length === 0 && (
            <p className="text-center text-gray-500 mt-10">No doctors found.</p>
          )}
        </div>
      </section>

      <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center">What Our Patients Say</h2>
            <p className="text__para text-center">
              World-class care for everyone. Our health system offers unmatched, expert health care.
            </p>
          </div>
          <Testimonial />
        </div>
      </section>
    </>
  );
};

export default Doctors;
