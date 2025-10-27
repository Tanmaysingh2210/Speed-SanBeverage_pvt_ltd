import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import toast from "react-hot-toast";

const SKUContext = createContext();

export function SKUProvider({ children }) {
  const [containers, setContainers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [flavours, setFlavours] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);


  //containers



  const getAllContainers = async () => {
    try {
      setLoading(true);
      const res = await api.get("/container/");
      setContainers(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching containers");
    } finally {
      setLoading(false);
    }
  };

  const getContainerByID = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/container/${id}`);
      setContainers(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching container");
    } finally {
      setLoading(false);
    }
  };

  const addContainer = async (payload) => {
    try {
      setLoading(true);

      const res = await api.post("/container/", payload);
      toast.success(res.data.message || "Container added successfully");
      getAllContainers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding container");
    } finally {
      setLoading(false);
    }
  };

  const updateContainer = async (id, payload) => {
    try {
      setLoading(true);

      const res = await api.patch(`/container/${id}`, payload);
      toast.success(res.data.message || "Container updated");
      getAllContainers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating container");
    } finally {
      setLoading(false);
    }
  };

  const deleteContainer = async (id) => {
    try {
      setLoading(true);

      const res = await api.delete(`/container/delete/${id}`);
      toast.success(res.data.message || "container deleted");
      setContainers(containers.filter((c) => c._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting container");
      throw err;
    } finally {
      setLoading(false);
    }
  };


  //package


  const getAllPackages = async () => {
    try {
      setLoading(true);
      const res = await api.get("/package/");
      setPackages(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching packages");
    } finally {
      setLoading(false);
    }
  };

  const getPackageByID = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/package/${id}`);
      setPackages(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching package");
    } finally {
      setLoading(false);
    }
  };

  const addPackage = async (payload) => {
    try {
      setLoading(true);

      const res = await api.post("/package/", payload);
      toast.success(res.data.message || "package added successfully");
      getAllPackages();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding package");
    } finally {
      setLoading(false);
    }
  };

  const updatePackage = async (id, payload) => {
    try {
      setLoading(true);

      const res = await api.patch(`/package/${id}`, payload);
      toast.success(res.data.message || "package updated");
      getAllPackages();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating package");
    } finally {
      setLoading(false);
    }
  };

  const deletePackage = async (id) => {
    try {
      setLoading(true);

      const res = await api.delete(`/package/delete/${id}`);
      toast.success(res.data.message || "package deleted");
      setPackages(packages.filter((c) => c._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting package");
      throw err;
    } finally {
      setLoading(false);
    }
  };


  //flavour


  const getAllFlavours = async () => {
    try {
      setLoading(true);
      const res = await api.get("/flavour/");
      setFlavours(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching flavour");
    } finally {
      setLoading(false);
    }
  };

  const getFlavourByID = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/flavour/${id}`);
      setFlavours(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching flavour");
    } finally {
      setLoading(false);
    }
  };

  const addFlavour = async (payload) => {
    try {
      setLoading(true);

      const res = await api.post("/flavour/", payload);
      toast.success(res.data.message || "flavour added successfully");
      getAllFlavours();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding flavour");
    } finally {
      setLoading(false);
    }
  };

  const updateFlavour = async (id, payload) => {
    try {
      setLoading(true);

      const res = await api.patch(`/flavour/${id}`, payload);
      toast.success(res.data.message || "flavour updated");
      getAllFlavours();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating flavour");
    } finally {
      setLoading(false);
    }
  };

  const deleteFlavour = async (id) => {
    try {
      setLoading(true);

      const res = await api.delete(`/flavour/delete/${id}`);
      toast.success(res.data.message || "flavour deleted");
      setFlavours(flavours.filter((c) => c._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting flavour");
      throw err;
    } finally {
      setLoading(false);
    }
  };



  //items 


  const getAllItems = async () => {
    try {
      setLoading(true);
      const res = await api.get("/item/");
      setItems(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching items");
    } finally {
      setLoading(false);
    }
  };

  const getItemByID = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/item/${id}`);
      setFlavours(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching flavour");
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (payload) => {
    try {
      setLoading(true);

      console.log('SKUContext.addItem', payload);
      const res = await api.post("/item/", payload);
      toast.success(res.data.message || "Item added");
      getAllItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding item");
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id, payload) => {
    try {
      setLoading(true);

      const res = await api.patch(`/item/${id}`, payload);
      toast.success(res.data.message || "Item updated");
      getAllItems();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating item");
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      setLoading(true);

      const res = await api.delete(`/item/delete/${id}`);
      toast.success(res.data.message || "Item deleted");
      setItems(items.filter((i) => i._id !== id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting item");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllContainers();
    getAllFlavours();
    getAllPackages();
    getAllItems();
  }, []);

  return (
    <SKUContext.Provider
      value={{
        containers,
        items,
        getContainerByID,
        loading,
        addContainer,
        updateContainer,
        deleteContainer,
        addItem,
        updateItem,
        deleteItem,
        getAllContainers,
        getAllItems,
        getItemByID,


        packages,
        getAllPackages,
        getPackageByID,
        updatePackage,
        deletePackage,
        addPackage,

        flavours,
        getAllFlavours,
        getFlavourByID,
        updateFlavour,
        deleteFlavour,
        addFlavour,



      }}
    >
      {children}
    </SKUContext.Provider>
  );
}

export const useSKU = () => useContext(SKUContext);
