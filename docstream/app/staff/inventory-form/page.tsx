'use client'

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

interface InventoryForm {
  retail_outlet: string;
  retail_outlet_address: string;
  pms_opening: string;
  product_recieved: string;
  price_range: string;
  pump_dispensing_level: string;
}

const InventoryForm = () => {
  const { user, accessToken, isLoading } = useAuth();
  const router = useRouter();
  
  const [form, setForm] = useState<InventoryForm>({
    retail_outlet: "",
    retail_outlet_address: "",
    pms_opening: "",
    product_recieved: "",
    price_range: "",
    pump_dispensing_level: "",
  });

  const [loading, setLoading] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && (!accessToken || !user)) {
      router.push('/login');
    }
  }, [accessToken, user, isLoading, router]);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user?.id || !accessToken) {
      alert("❌ You must be logged in before submitting inventory!");
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/v1/inventory-checklist/", 
        {
          ...form,
          created_by: user.id,
        }, 
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          }
        }
      );

      alert("✅ Inventory submitted successfully!");

      // Reset form
      setForm({
        retail_outlet: "",
        retail_outlet_address: "",
        pms_opening: "",
        product_recieved: "",
        price_range: "",
        pump_dispensing_level: "",
      });
    } catch (error: any) {
      console.error("Error submitting form:", error.response || error);
      
      if (error.response?.status === 401) {
        alert("❌ Session expired. Please login again.");
        router.push('/login');
      } else {
        alert("❌ Failed to submit inventory. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="bg-gray-100 min-h-screen rounded-2xl py-8 px-4 flex justify-center items-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!accessToken || !user) {
    return null;
  }

  return (
    <div className="bg-gray-100 min-h-screen rounded-2xl py-8 px-4 flex justify-center items-start">
      <div className="bg-white rounded-xl p-8 w-full max-w-6xl shadow-lg">
        {/* User Info Header */}
        <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Inventory Checklist</h2>
              <p className="text-sm text-gray-600 mt-1">
                Welcome, <span className="font-semibold">{user.staff_id}</span> | 
                Role: <span className="font-semibold">{user.role}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Department</p>
              <p className="text-sm font-medium text-gray-700">{user.department}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Retail Outlet *
              </label>
              <input
                type="text"
                name="retail_outlet"
                value={form.retail_outlet}
                onChange={handleChange}
                placeholder="Enter retail outlet name"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Retail Outlet Address *
              </label>
              <input
                type="text"
                name="retail_outlet_address"
                value={form.retail_outlet_address}
                onChange={handleChange}
                placeholder="Enter full address"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                PMS Opening *
              </label>
              <input
                type="number"
                name="pms_opening"
                value={form.pms_opening}
                onChange={handleChange}
                placeholder="Enter PMS opening value"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Received *
              </label>
              <input
                type="number"
                name="product_recieved"
                value={form.product_recieved}
                onChange={handleChange}
                placeholder="Enter product received"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Price Range *
              </label>
              <input
                type="text"
                name="price_range"
                value={form.price_range}
                onChange={handleChange}
                placeholder="e.g., 100-150"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pump Dispensing Level *
              </label>
              <input
                type="number"
                name="pump_dispensing_level"
                value={form.pump_dispensing_level}
                onChange={handleChange}
                placeholder="Enter dispensing level"
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-colors"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-amber-500 hover:bg-amber-600 text-white border-none rounded-lg py-2.5 px-6 mt-8 cursor-pointer transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center w-full md:w-auto"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Submitting...
              </>
            ) : (
              "Submit Inventory"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;