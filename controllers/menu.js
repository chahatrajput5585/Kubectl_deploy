const Menu = require("../model/menu");

const getAllMenuItems = async (req, res) => {
  try {
    // For admin users, show all items including inactive ones
    const isAdmin = req.user && req.user.isAdmin;
    const filter = isAdmin ? {} : { isActive: true };
    
    const menuItems = await Menu.find(filter)
      .populate("addedBy", "name")
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: menuItems,
    });
  } catch (error) {
    console.error("Get menu items error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const createMenuItem = async (req, res) => {
  try {
    const { name, type, price, originalPrice, image, desc, popular } = req.body;

    const menuItem = new Menu({
      name,
      type,
      price,
      originalPrice,
      image,
      desc,
      popular: popular || false,
      addedBy: req.user._id,
    });

    await menuItem.save();

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: menuItem,
    });
  } catch (error) {
    console.error("Create menu item error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const menuItem = await Menu.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      data: menuItem,
    });
  } catch (error) {
    console.error("Update menu item error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;

    const menuItem = await Menu.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.error("Delete menu item error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const menuItem = await Menu.findById(id).populate("addedBy", "name");

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      data: menuItem,
    });
  } catch (error) {
    console.error("Get menu item error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

module.exports = {
  getAllMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  getMenuItemById,
};
