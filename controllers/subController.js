import Subscription from "../models/subModel.js";

// Create a new subscription
export const createSubscription = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Check for duplicate email
    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ message: "Email already subscribed" });
    }

    const newSubscription = await Subscription.create({ email });
    res.status(201).json(newSubscription);
  } catch (error) {
    console.error("Error creating subscription:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getSubscriptions = async (req, res) => {
    try {
      const subscriptions = await Subscription.find();
      res.status(200).json(subscriptions);
    } catch (error) {
      console.error("Error fetching subscriptions:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  // Update a subscription by ID
  export const updateSubscription = async (req, res) => {
    try {
      const { id } = req.params;
      const { email } = req.body;
  
      // Check if the new email already exists
      const existingSubscription = await Subscription.findOne({ email });
      if (existingSubscription) {
        return res.status(400).json({ message: "Email already subscribed" });
      }
  
      const updatedSubscription = await Subscription.findByIdAndUpdate(
        id,
        { email },
        { new: true } // Return the updated document
      );
  
      if (!updatedSubscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }
  
      res.status(200).json(updatedSubscription);
    } catch (error) {
      console.error("Error updating subscription:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  // Delete a subscription by ID
  export const deleteSubscription = async (req, res) => {
    try {
      const { id } = req.params;
      const deletedSubscription = await Subscription.findByIdAndDelete(id);
  
      if (!deletedSubscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }
  
      res.status(200).json({ message: "Subscription deleted successfully" });
    } catch (error) {
      console.error("Error deleting subscription:", error.message);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
