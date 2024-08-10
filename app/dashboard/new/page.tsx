import React from "react";

export default function page() {
  return <div>pageee</div>;
}

// "use client";
// import React, { useState, useCallback } from "react";
// import clsx from "clsx";
// import { Input } from "@/components/ui/input";

// import {
//   AddressAutofill,
//   AddressMinimap,
//   useConfirmAddress,
// } from "@mapbox/search-js-react";

// const MAPBOX_ACCESS_TOKEN =
//   "pk.eyJ1IjoiYnVzeW1pbmlzMyIsImEiOiJjbHo0NWtvMGMwOGV0Mm5vbXBrdWpzeTFsIn0.M7KP1szOMBQaDaS6RwXhWA";

// const MapboxAddressAutofill = ({ onAddressSelect }) => {
//   const [minimapFeature, setMinimapFeature] = useState();
//   const { formRef, showConfirm } = useConfirmAddress({
//     accessToken: MAPBOX_ACCESS_TOKEN,
//   });

//   const handleAutofillRetrieve = (response) => {
//     setMinimapFeature(response.features[0]);
//   };

//   const handleFormSubmit = useCallback(
//     async (e) => {
//       e.preventDefault();
//       const result = await showConfirm();

//       if (result.type === "nochange") {
//         onAddressSelect(
//           e.target.elements["pickupAddress"].value,
//           e.target.elements["dropoffAddress"].value
//         );
//       } else if (result.type === "change") {
//         onAddressSelect(
//           result.feature.properties.address,
//           result.feature.properties.address
//         );
//       }
//     },
//     [showConfirm, onAddressSelect]
//   );

//   return (
//     <div>
//       <form ref={formRef} onSubmit={handleFormSubmit} className="space-y-6">
//         <AddressAutofill
//           accessToken={MAPBOX_ACCESS_TOKEN}
//           onRetrieve={handleAutofillRetrieve}
//         >
//           <div>
//             <label
//               htmlFor="pickupAddress"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Pickup Address
//             </label>
//             <Input
//               id="pickupAddress"
//               name="pickupAddress"
//               type="text"
//               autoComplete="address-line1"
//               required
//               className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
//             />
//           </div>
//         </AddressAutofill>
//         <AddressAutofill
//           accessToken={MAPBOX_ACCESS_TOKEN}
//           onRetrieve={handleAutofillRetrieve}
//         >
//           <div>
//             <label
//               htmlFor="dropoffAddress"
//               className="block text-sm font-medium text-gray-700"
//             >
//               Dropoff Address
//             </label>
//             <Input
//               id="dropoffAddress"
//               name="dropoffAddress"
//               type="text"
//               autoComplete="address-line1"
//               required
//               className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
//             />
//           </div>
//         </AddressAutofill>
//         <div
//           id="minimap-container"
//           className={clsx("h180 wfull relative mt18 mb60", {
//             none: !minimapFeature,
//           })}
//         >
//           <AddressMinimap
//             feature={minimapFeature}
//             show={!!minimapFeature}
//             satelliteToggle
//             canAdjustMarker
//             footer
//             accessToken={MAPBOX_ACCESS_TOKEN}
//           />
//         </div>
//         <button type="submit" className="w-full bg-theme-orange">
//           Confirm Address
//         </button>
//       </form>
//     </div>
//   );
// };
