import { useState, useEffect, useCallback, useMemo } from "react";
import Testimonial from "../components/Testimonial/Testimonial";
import AmbulanceCard from "../components/AmbulanceCard";
import { BASE_URL } from "../config";
import Loader from "../components/Loader/Loading";
import Error from "../components/Error/Error";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const containerStyle = {
  width: "100%",
  height: "500px", // Adjust height as needed
};

// Define libraries outside the component to prevent re-creation on every render
const libraries = ["places"];

const Ambulances = () => {
  const [query, setQuery] = useState("");
  const [debounceQuery, setDebounceQuery] = useState("");
  const [useNearby, setUseNearby] = useState(false);
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [ambulances, setAmbulances] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const navigate = useNavigate(); // Initialize useNavigate hook

  // Load Google Maps script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyBuV0Nzhsjzt5ftVqMq5jpP3pncBG_6kLs", // Make sure to replace with your actual API key
    libraries: libraries, // Use the static libraries array
  });

  // Define icons inside the component, where `isLoaded` is available
  const defaultUserIcon = useMemo(() => isLoaded
    ? {
        url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png", // A standard blue dot icon
        scaledSize: new window.google.maps.Size(40, 40),
      }
    : undefined, [isLoaded]);

  const defaultAmbulanceIcon = useMemo(() => isLoaded
    ? {
        url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // A standard red dot icon
        scaledSize: new window.google.maps.Size(40, 40),
      }
    : undefined, [isLoaded]);

  // Debounce query input
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounceQuery(query.trim());
    }, 700);
    return () => clearTimeout(timeout);
  }, [query]);

  // Get current location if "Nearby" is enabled
  useEffect(() => {
    if (useNearby) {
      if (!navigator.geolocation) {
        console.warn("Geolocation is not supported by your browser.");
        alert("Geolocation is not supported by your browser");
        setUseNearby(false);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          console.log("User's Current Location (Fetched):", { lat: latitude, lng: longitude });
          setLocation({
            lat: latitude,
            lng: longitude,
          });
        },
        (err) => {
          console.error("Geolocation error:", err.message);
          alert("Location access denied. Please enable it in your browser settings or use the search bar instead.");
          setUseNearby(false);
        }
      );
    }
  }, [useNearby]);

  // Fetch ambulances based on query or location
  useEffect(() => {
    const fetchAmbulances = async () => {
      if (!useNearby && debounceQuery.length === 0) {
        setAmbulances([]);
        console.log("No search query and not using nearby. Clearing ambulances.");
        return;
      }

      if (useNearby && (location.lat === null || location.lng === null)) {
        console.log("Using nearby, but user location not yet available. Waiting to fetch ambulances.");
        return;
      }

      setLoading(true);
      setError(false);

      try {
        let response;
        if (useNearby) {
          console.log("Fetching nearby ambulances for:", { lat: location.lat, lng: location.lng });
          response = await fetch(`${BASE_URL}/ambulances/nearby`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              latitude: location.lat,
              longitude: location.lng,
            }),
          });
        } else {
          console.log("Fetching ambulances by query:", debounceQuery);
          response = await fetch(`${BASE_URL}/ambulances?query=${debounceQuery}`);
        }

        const result = await response.json();

        if (!result.success) throw new Error(result.message || "Failed to fetch ambulances");

        setAmbulances(result.data);
        console.log("Fetched ambulances data:", result.data);
      } catch (err) {
        console.error("Error fetching ambulances:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAmbulances();
  }, [debounceQuery, useNearby, location]);

  const handleSearch = () => {
    setUseNearby(false);
    console.log("Search button clicked. Setting useNearby to false.");
  };

  // Handler for ambulance marker click
  const handleAmbulanceMarkerClick = useCallback((ambulanceId) => {
    console.log("Ambulance marker clicked. Navigating to:", `/ambulance-service/${ambulanceId}`);
    navigate(`/ambulance-service/${ambulanceId}`);
  }, [navigate]); // navigate is a dependency for useCallback

  const onMapLoad = useCallback((map) => {
    console.log("Google Map loaded:", map);
  }, []);

  const onMapUnmount = useCallback((map) => {
    console.log("Google Map unmounted:", map);
  }, []);

  if (loadError) return <div>Error loading maps</div>;

  return (
    <>
      <section className="bg-[#caf0f8]">
        <div className="container text-center">
          <h2 className="heading">Find an Ambulance</h2>

          <div
            className="max-w-[570px] mt-[30px] mx-auto bg-[#c1c8d22c] rounded-lg
          flex items-center justify-between bg-[#f5f9fa] p-2 border-2 border-gray-300 hover:border-black focus:outline-black"
          >
            <input
              type="search"
              className="py-2 bg-transparent w-2/3 focus:outline-none text-[18px] cursor-pointer placeholder:text-textColor bg-[#f5f9fa]"
              placeholder="Search by Region"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setUseNearby(false);
              }}
              disabled={useNearby}
            />
            <button
              className="btn mt-0 mb-0 py-[10px] mr-1 rounded-lg"
              onClick={handleSearch}
              disabled={useNearby || query.trim().length === 0}
            >
              Search
            </button>
            <button
              className="btn mt-0 mb-0 py-[10px] ml-1 rounded-lg"
              onClick={() => {
                setUseNearby(true);
                setQuery("");
              }}
              disabled={useNearby || !("geolocation" in navigator)}
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

          {useNearby && isLoaded && !loading && !error && location.lat !== null && location.lng !== null && (
            <div className="mt-[30px] lg:mt-[55px]">
              <h3 className="text-center text-2xl font-bold mb-4">Nearby Ambulances on Map</h3>
              <GoogleMap
                mapContainerStyle={containerStyle}
                center={{ lat: location.lat, lng: location.lng }}
                zoom={14}
                onLoad={onMapLoad}
                onUnmount={onMapUnmount}
              >
                {/* Marker for user's current location */}
                {defaultUserIcon && (
                  <MarkerF position={{ lat: location.lat, lng: location.lng }} title="Your Location" icon={defaultUserIcon} />
                )}
                {console.log("User Marker Position (Map Center):", { lat: location.lat, lng: location.lng })}

                {/* Markers for nearby ambulances */}
                {ambulances.map((ambulance) => {
                  const ambLat = ambulance.location.coordinates[1]; // Latitude
                  const ambLng = ambulance.location.coordinates[0]; // Longitude
                  console.log(`Ambulance Marker Position (${ambulance.name || 'Unnamed Ambulance'}):`, { lat: ambLat, lng: ambLng });

                  return (
                    <MarkerF
                      key={ambulance._id}
                      position={{
                        lat: ambLat,
                        lng: ambLng,
                      }}
                      title={ambulance.name}
                      icon={
                        isLoaded && ambulance.photo
                          ? {
                              url: ambulance.photo,
                              scaledSize: new window.google.maps.Size(50, 50),
                              origin: new window.google.maps.Point(0, 0),
                              anchor: new window.google.maps.Point(25, 25),
                            }
                          : defaultAmbulanceIcon
                      }
                      onClick={() => handleAmbulanceMarkerClick(ambulance._id)} // Add onClick handler
                    />
                  );
                })}
              </GoogleMap>
            </div>
          )}

          {!useNearby && !loading && !error && ambulances?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 lg:gap-[30px] mt-[30px] lg:mt-[55px]">
              {ambulances.map((ambulance) => (
                <AmbulanceCard key={ambulance._id} ambulance={ambulance} />
              ))}
            </div>
          )}
          {!loading && !error && ambulances?.length === 0 && (
            <p className="text-center text-gray-500 mt-10">No ambulances found.</p>
          )}
        </div>
      </section>

      <section>
        <div className="container">
          <div className="xl:w-[470px] mx-auto">
            <h2 className="heading text-center">What Our Patient Say</h2>
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

export default Ambulances;