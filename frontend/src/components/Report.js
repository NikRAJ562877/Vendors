import React, { useState } from "react";
import axios from "axios";

const Report = () => {
  const [reports, setReports] = useState([]);
  const [category, setCategory] = useState("");

  const addCategory = () => {
    if (!category.trim()) return;
    setReports([...reports, { category, items: [], totalAmount: 0 }]);
    setCategory("");
  };

  const addItem = (index) => {
    const newItem = { partNo: "", productName: "", quantity: 1, amount: 0 };
    const updatedReports = [...reports];
    updatedReports[index].items.push(newItem);
    setReports(updatedReports);
  };

  const handleChange = (catIndex, itemIndex, field, value) => {
    const updatedReports = [...reports];
    let item = updatedReports[catIndex].items[itemIndex];
    item[field] = field === "quantity" || field === "amount" ? Number(value) : value;

    updatedReports[catIndex].totalAmount = updatedReports[catIndex].items.reduce(
      (sum, item) => sum + item.amount,
      0
    );

    setReports(updatedReports);
  };

  const handleSubmit = async () => {
    try {
      for (let report of reports) {
        await axios.post("http://localhost:5000/api/reports", report);
      }
      alert("Report submitted successfully!");
      setReports([]);
    } catch (error) {
      console.error("Error submitting report:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-4">Admin Report</h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Enter Category (e.g., CERAMIC, PPF)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border p-2 rounded mr-2"
        />
        <button
          onClick={addCategory}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Category
        </button>
      </div>

      {reports.map((report, catIndex) => (
        <div key={catIndex} className="mb-6">
          <h3 className="text-xl font-semibold mb-2">{report.category}</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Part No.</th>
                <th className="border p-2">Product Name</th>
                <th className="border p-2">Qty</th>
                <th className="border p-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {report.items.map((item, itemIndex) => (
                <tr key={itemIndex}>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={item.partNo}
                      onChange={(e) => handleChange(catIndex, itemIndex, "partNo", e.target.value)}
                      className="w-full p-1"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="text"
                      value={item.productName}
                      onChange={(e) => handleChange(catIndex, itemIndex, "productName", e.target.value)}
                      className="w-full p-1"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleChange(catIndex, itemIndex, "quantity", e.target.value)}
                      className="w-full p-1"
                    />
                  </td>
                  <td className="border p-2">
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => handleChange(catIndex, itemIndex, "amount", e.target.value)}
                      className="w-full p-1"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => addItem(catIndex)} className="bg-green-500 text-white px-3 py-1 mt-2">
            Add Item
          </button>
          <p className="font-bold mt-2">Total Amount: {report.totalAmount}</p>
        </div>
      ))}

      <h3 className="text-lg font-bold">Grand Total: {reports.reduce((sum, report) => sum + report.totalAmount, 0)}</h3>
      <button onClick={handleSubmit} className="bg-red-500 text-white px-4 py-2 rounded">
        Submit Report
      </button>
    </div>
  );
};

export default Report;
