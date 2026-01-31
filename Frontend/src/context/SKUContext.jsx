import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const SKUContext = createContext();

export function SKUProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [containers, setContainers] = useState([]);
  const [packages, setPackages] = useState([]);
  const [flavours, setFlavours] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const getAllContainers = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/container`);
      setContainers(res.data);
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching containers");
      throw err;
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
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addContainer = async (payload) => {
    try {
      setLoading(true);

      const res = await api.post("/container/", payload);
      toast.success(res.data.message || "Container added successfully");
      await getAllContainers();
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding container");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateContainer = async (id, payload) => {
    try {
      setLoading(true);
      const res = await api.patch(`/container/${id}`, payload);
      toast.success(res.data.message || "Container updated");
      await getAllContainers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating container");
      throw err;
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
      return res;
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
      const res = await api.get(`/package`);
      setPackages(res.data);
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching packages");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPackageByID = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/package/${id}`);
      setPackages(res.data);
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching package");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addPackage = async (payload) => {
    try {
      setLoading(true);
      const res = await api.post("/package/", payload);
      toast.success(res.data.message || "package added successfully");
      await getAllPackages();
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding package");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePackage = async (id, payload) => {
    try {
      setLoading(true);

      const res = await api.patch(`/package/${id}`, payload);
      toast.success(res.data.message || "package updated");
      await getAllPackages();
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating package");
      throw err;
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
      return res;
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
      const res = await api.get(`/flavour`);
      setFlavours(res.data);
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching flavour");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getFlavourByID = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/flavour/${id}`);
      setFlavours(res.data);
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching flavour");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addFlavour = async (payload) => {
    try {
      setLoading(true);

      const res = await api.post("/flavour/", payload);
      toast.success(res.data.message || "flavour added successfully");
      await getAllFlavours();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding flavour");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFlavour = async (id, payload) => {
    try {
      setLoading(true);
      const res = await api.patch(`/flavour/${id}`, payload);
      toast.success(res.data.message || "flavour updated");
      await getAllFlavours();
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating flavour");
      throw err;
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
      return res;
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
      const res = await api.get(`/item`);
      setItems(res.data);
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching items");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getItemByID = async (id) => {
    try {
      setLoading(true);
      const res = await api.get(`/item/${id}`);
      setFlavours(res.data);
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error fetching flavour");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (payload) => {
    try {
      setLoading(true);
      const res = await api.post("/item/", payload);
      toast.success(res.data.message || "Item added");
      await getAllItems();
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id, payload) => {
    try {
      setLoading(true);
      const res = await api.patch(`/item/${id}`, payload);
      toast.success(res.data.message || "Item updated");
      await getAllItems();
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error updating item");
      throw err;
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
      return res;
    } catch (err) {
      toast.error(err.response?.data?.message || "Error deleting item");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAll = async () => {
      try {
        setLoading(true);

        await Promise.all([
          getAllContainers(),
          getAllFlavours(),
          getAllPackages(),
          getAllItems()
        ]);

      } catch (err) {
        console.error("Failed to load initial data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, [isAuthenticated]);


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
