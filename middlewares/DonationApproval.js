import Donation from "../models/DonationModel";
export const filterApprovedDonation = async (req, res, next) => {
  try {
    // Fetch the projects with "Approved" status
    const approvedDonation = await Donation.find({
      approvalStatus: "Approved",
    });

    // Attach the filtered projects to the request object (optional)
    req.filteredProjects = approvedDonation;

  
    next();
  } catch (error) {
    // Handle any errors
    res.status(500).json({ message: error.message });
  }
};