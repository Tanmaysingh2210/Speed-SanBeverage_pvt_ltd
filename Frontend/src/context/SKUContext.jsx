import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/api";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const SKUContext = createContext();

export function SKUProvider({ children }) {
  const {showToast} = useToast();
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
      showToast(err.response?.data?.message || "Error fetching containers", "error");
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
      showToast(err.response?.data?.message || "Error fetching container", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addContainer = async (payload) => {
    try {
      setLoading(true);

      const res = await api.post("/container/", payload);
      showToast(res.data.message || "Container added successfully", "success");
      await getAllContainers();
      return res;
    } catch (err) {
      showToast(err.response?.data?.message || "Error adding container", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateContainer = async (id, payload) => {
    try {
      setLoading(true);
      const res = await api.patch(`/container/${id}`, payload);
      showToast(res.data.message || "Container updated", "success");
      await getAllContainers();
    } catch (err) {
      showToast(err.response?.data?.message || "Error updating container", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteContainer = async (id) => {
    try {
      setLoading(true);

      const res = await api.delete(`/container/delete/${id}`);
      showToast(res.data.message || "container deleted", "success");
      setContainers(containers.filter((c) => c._id !== id));
      return res;
    } catch (err) {
      showToast(err.response?.data?.message || "Error deleting container" , "error");
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
      showToast(err.response?.data?.message || "Error fetching packages", "error");
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
      showToast(err.response?.data?.message || "Error fetching package", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addPackage = async (payload) => {
    try {
      setLoading(true);
      const res = await api.post("/package/", payload);
      showToast(res.data.message || "package added successfully", "success");
      await getAllPackages();
      return res;
    } catch (err) {
      showToast(err.response?.data?.message || "Error adding package", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePackage = async (id, payload) => {
    try {
      setLoading(true);

      const res = await api.patch(`/package/${id}`, payload);
      showToast(res.data.message || "package updated", "success");
      await getAllPackages();
      return res;
    } catch (err) {
      showToast(err.response?.data?.message || "Error updating package", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deletePackage = async (id) => {
    try {
      setLoading(true);

      const res = await api.delete(`/package/delete/${id}`);
      showToast(res.data.message || "package deleted", "success");
      setPackages(packages.filter((c) => c._id !== id));
      return res;
    } catch (err) {
      showToast(err.response?.data?.message || "Error deleting package", "error");
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
      showToast(err.response?.data?.message || "Error fetching flavour", "error");
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
      showToast(err.response?.data?.message || "Error fetching flavour", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addFlavour = async (payload) => {
    try {
      setLoading(true);

      const res = await api.post("/flavour/", payload);
      showToast(res.data.message || "flavour added successfully", "success");
      await getAllFlavours();
    } catch (err) {
      showToast(err.response?.data?.message || "Error adding flavour", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateFlavour = async (id, payload) => {
    try {
      setLoading(true);
      const res = await api.patch(`/flavour/${id}`, payload);
      showToast(res.data.message || "flavour updated", "success");
      await getAllFlavours();
      return res;
    } catch (err) {
      showToast(err.response?.data?.message || "Error updating flavour", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFlavour = async (id) => {
    try {
      setLoading(true);
      const res = await api.delete(`/flavour/delete/${id}`);
      showToast(res.data.message || "flavour deleted", "success");
      setFlavours(flavours.filter((c) => c._id !== id));
      return res;
    } catch (err) {
      showToast(err.response?.data?.message || "Error deleting flavour", "error");
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
      showToast(err.response?.data?.message || "Error fetching items", "error");
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
      showToast(err.response?.data?.message || "Error fetching flavour", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const addItem = async (payload) => {
    try {
      setLoading(true);
      const res = await api.post("/item/", payload);
      showToast(res.data.message || "Item added", "success");
      await getAllItems();
      return res;
    } catch (err) {
      showToast(err.response?.data?.message || "Error adding item", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id, payload) => {
    try {
      setLoading(true);
      const res = await api.patch(`/item/${id}`, payload);
      showToast(res.data.message || "Item updated", "success");
      await getAllItems();
      return res;
    } catch (err) {
      showToast(err.response?.data?.message || "Error updating item", "error");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (id) => {
    try {
      setLoading(true);
      const res = await api.delete(`/item/delete/${id}`);
      showToast(res.data.message || "Item deleted", "success");
      setItems(items.filter((i) => i._id !== id));
      return res;
    } catch (err) {
      showToast(err.response?.data?.message || "Error deleting item", "error");
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
