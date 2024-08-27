// "use client";

// import { User } from "@phosphor-icons/react/dist/ssr";
// import React, { useEffect, useState } from "react";
// import {
//   addChild,
//   deleteChild,
//   getChildren,
// } from "@/utils/supabase/supabaseQueries";
// import Image from "next/image";

// // Define the type for a child
// interface Child {
//   id: number;
//   first_name: string;
//   last_name: string;
//   birthdate: string;
// }

// // Define the type for the rider state
// interface Rider {
//   name: string;
//   children: Child[];
// }

// const RiderProfile = () => {
//   // Initialize the state with the correct type
//   const [rider, setRider] = useState<Rider>({
//     name: "Johnathan Alexander Doe",
//     children: [],
//   });

//   const [newChild, setNewChild] = useState({
//     first_name: "",
//     last_name: "",
//     birthdate: "",
//   });

//   const [isAddingChild, setIsAddingChild] = useState(false); // To control form visibility

//   const userId = "dea16759-3066-48bc-b88e-cff23de57d6a"; // Replace with actual user ID

//   useEffect(() => {
//     const fetchChildren = async () => {
//       const children = await getChildren(userId);
//       setRider((prevRider) => ({ ...prevRider, children }));
//     };

//     fetchChildren();
//   }, []);

//   const handleAddChild = async () => {
//     if (newChild.first_name && newChild.last_name && newChild.birthdate) {
//       await addChild({ user_id: userId, ...newChild });
//       const children = await getChildren(userId);
//       setRider((prevRider) => ({ ...prevRider, children }));
//       setNewChild({ first_name: "", last_name: "", birthdate: "" });
//       setIsAddingChild(false); // Hide the form after adding a child
//     }
//   };

//   const handleDeleteChild = async (id: number) => {
//     await deleteChild(id);
//     const children = await getChildren(userId);
//     setRider((prevRider) => ({ ...prevRider, children }));
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     setNewChild((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };

//   const showAddChildForm = () => {
//     setIsAddingChild(true);
//   };

//   const handleCancel = () => {
//     setIsAddingChild(false);
//     setNewChild({ first_name: "", last_name: "", birthdate: "" });
//   };

//   return (
//     <section className="text-zinc-700 p-4 sm:p-6 lg:p-8">
//       <h3 className="text-2xl font-bold mb-8 text-center text-gray-800">
//         Rider Profile
//       </h3>
//       <div className="mt-8">
//         <section className="text-center mb-6 bg-zinc-800 border text-white py-8 rounded-md shadow-lg">
//           <div className="flex justify-center bg-white py-4 border mx-auto rounded-full h-48 w-48">
//             <Image
//               src={"/logo.png"}
//               width={200}
//               height={200}
//               alt="logo"
//               className="object-cover"
//             />
//           </div>
//           <h2 className="text-xl sm:text-2xl mt-4 ">{rider.name}</h2>
//         </section>
//         <div className="bg-white border rounded-md p-6 sm:p-8 shadow-lg">
//           <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">
//             Riders
//           </h3>
//           <div className="space-y-4">
//             {rider.children.map((child) => (
//               <div
//                 key={child.id}
//                 className="flex flex-col sm:flex-row items-center justify-between bg-gray-50 p-4 rounded-lg shadow-md"
//               >
//                 <div className="flex items-center mb-4 sm:mb-0">
//                   <User weight="fill" size={24} className="text-gray-600" />
//                   <span className="ml-2 text-base sm:text-lg font-medium text-gray-800">
//                     {child.first_name} {child.last_name} (DOB: {child.birthdate}
//                     )
//                   </span>
//                 </div>
//                 <div className="flex space-x-2">
//                   <button
//                     onClick={() => handleDeleteChild(child.id)}
//                     className="px-3 py-1 text-sm sm:text-base bg-red-600 text-white rounded hover:bg-red-700 transition"
//                   >
//                     Delete
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {isAddingChild ? (
//             <div className="mt-6">
//               <h4 className="text-md sm:text-lg font-semibold mb-4 text-gray-800">
//                 Add a New Child
//               </h4>
//               <div className="space-y-4">
//                 <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
//                   <input
//                     type="text"
//                     name="first_name"
//                     placeholder="First Name"
//                     value={newChild.first_name}
//                     onChange={handleInputChange}
//                     className="px-4 py-2 border rounded w-full"
//                   />
//                   <input
//                     type="text"
//                     name="last_name"
//                     placeholder="Last Name"
//                     value={newChild.last_name}
//                     onChange={handleInputChange}
//                     className="px-4 py-2 border rounded w-full"
//                   />
//                 </div>
//                 <input
//                   type="date"
//                   name="birthdate"
//                   placeholder="Birthdate"
//                   value={newChild.birthdate}
//                   onChange={handleInputChange}
//                   className="px-4 py-2 border rounded w-full"
//                 />
//                 <div className="flex space-x-4">
//                   <button
//                     onClick={handleAddChild}
//                     className="px-4 py-2 text-sm sm:text-base bg-green-600 text-white rounded hover:bg-green-700 transition w-full sm:w-auto"
//                   >
//                     Confirm
//                   </button>
//                   <button
//                     onClick={handleCancel}
//                     className="px-4 py-2 text-sm sm:text-base bg-gray-600 text-white rounded hover:bg-gray-700 transition w-full sm:w-auto"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <button
//               onClick={showAddChildForm}
//               className="mt-6 px-4 py-2 text-sm sm:text-base bg-blue-600 text-white rounded hover:bg-blue-700 transition w-full sm:w-auto"
//             >
//               Add Child
//             </button>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default RiderProfile;
