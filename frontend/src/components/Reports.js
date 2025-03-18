import React, { useState, useEffect } from "react";

const OrderForm = () => {
  const [categories] = useState(["Ultra Premium PPF", "Ceramic Coating"]);
  const [products, setProducts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState("");
  const [rows, setRows] = useState([]);
  const [finalTotal, setFinalTotal] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("");
  useEffect(() => {
    const fetchVendors = async () => {
        try {
          const response = await fetch("http://localhost:5000/api/dlr/vendors");
          const data = await response.json(); // Use response.json()
          
          const filteredVendors = data
          .filter((v) => v.role === "vendor")
          .map((v) => ({
            value: v.vendorId, // Store vendorId as value
            label: v.vendorId, // Display vendorId (or use another identifier)
          }));
  
        setVendors(filteredVendors);
        } catch (error) {
          console.error("Error fetching vendors:", error);
        }
      };
    
      fetchVendors();

    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/products/getProducts");
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const addRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        category: "",
        partNo: "",
        productName: "",
        amount: 0,
        qty: 1,
        total: 0,
      },
    ]);
  };

  const removeRow = (index) => {
    setRows((prevRows) => {
      const updatedRows = prevRows.filter((_, i) => i !== index);
      calculateFinalTotal(updatedRows);
      return updatedRows;
    });
  };

  const handleRowChange = (index, field, value) => {
    setRows((prevRows) => {
      const updatedRows = [...prevRows];

      if (field === "category") {
        updatedRows[index] = {
          ...updatedRows[index],
          category: value,
          partNo: "",
          productName: "",
          amount: 0,
          total: 0,
        };
      } else if (field === "partNo") {
        const selectedProduct = products.find((p) => p.partNo === value);
        if (selectedProduct) {
          updatedRows[index] = {
            ...updatedRows[index],
            partNo: value,
            productName: selectedProduct.productName,
            amount: selectedProduct.amount,
            total: selectedProduct.amount * updatedRows[index].qty,
          };
        }
      } else if (field === "qty") {
        updatedRows[index] = {
          ...updatedRows[index],
          qty: Number(value),
          total: updatedRows[index].amount * Number(value),
        };
      } else {
        updatedRows[index][field] = value;
      }

      calculateFinalTotal(updatedRows);
      return updatedRows;
    });
  };

  const calculateFinalTotal = (updatedRows) => {
    const total = updatedRows.reduce((sum, row) => sum + row.total, 0);
    setFinalTotal(total);
  };

  const handleSubmit = async () => {
    if (!selectedVendor) {
      alert("Please select a vendor before saving the report.");
      return;
    }
    if (!selectedMonth) {
      alert("Please select a month before saving the report.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendor: selectedVendor, reports: rows, finalTotal ,month: selectedMonth,}),
      });
  
      if (response.ok) {
        alert("Report saved successfully!");
        setRows([]);
        setFinalTotal(0);
        setSelectedVendor("");
        setSelectedMonth("");
      }
    } catch (error) {
      console.error("Error saving report:", error);
    }
  };
  
  return (
    <div className="p-6 max-w-5xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-6">Order Form</h2>

      {/* Vendor Selection */}
      <div className="mb-6">
        <label className="block text-lg font-semibold mb-2">Select Vendor:</label>
        <select
  value={selectedVendor}
  onChange={(e) => setSelectedVendor(e.target.value)}
  className="border p-3 w-full rounded-lg"
>
  <option value="">-- Select Vendor --</option>
  {vendors.map((vendor) => (
    <option key={vendor.value} value={vendor.value}>
      {vendor.label}
    </option>
  ))}
</select>
      </div>
 {/* Month Selection */}
 <div className="mb-6">
      <label className="block text-lg font-semibold mb-2">Select Month:</label>
      <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="border p-3 w-full rounded-lg"
      >
        <option value="">-- Select Month --</option>
        {Array.from({ length: 12 }, (_, i) => {
          const month = new Date(0, i).toLocaleString("default", { month: "long" });
          return (
            <option key={i + 1} value={i + 1}>
              {month}
            </option>
          );
        })}
      </select>
    </div>
      {/* Order Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-300 text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-3">Category</th>
              <th className="border p-3">Part No</th>
              <th className="border p-3">Product Name</th>
              <th className="border p-3">Qty</th>
              <th className="border p-3">Amount</th>
              <th className="border p-3">Total</th>
              <th className="border p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index} className="border">
                <td className="border p-3">
                  <select
                    value={row.category}
                    onChange={(e) => handleRowChange(index, "category", e.target.value)}
                    className="border p-2 w-full rounded-md"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border p-3">
                  <select
                    value={row.partNo}
                    onChange={(e) => handleRowChange(index, "partNo", e.target.value)}
                    className="border p-2 w-full rounded-md"
                  >
                    <option value="">Select Part No</option>
                    {products
                      .filter((product) => product.category === row.category)
                      .map((product) => (
                        <option key={product.partNo} value={product.partNo}>
                          {product.partNo}
                        </option>
                      ))}
                  </select>
                </td>
                <td className="border p-3">{row.productName}</td>
                <td className="border p-3">
                  <input
                    type="number"
                    value={row.qty}
                    min="1"
                    onChange={(e) => handleRowChange(index, "qty", e.target.value)}
                    className="border p-2 text-center w-16 rounded-md"
                  />
                </td>
                <td className="border p-3">{row.amount}</td>
                <td className="border p-3">{row.total}</td>
                <td className="border p-3">
                  <button
                    onClick={() => removeRow(index)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button onClick={addRow} className="bg-blue-600 text-white px-6 py-2 rounded-md">
          Add Row
        </button>
        <h3 className="text-xl font-bold">Final Total: ₹{finalTotal}</h3>
        <button onClick={handleSubmit} className="bg-green-600 text-white px-6 py-2 rounded-md">
          Save Order
        </button>
      </div>
    </div>
  );
};

export default OrderForm;
