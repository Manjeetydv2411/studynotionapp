const Section = require("../models/section")
const Course = require("../models/Course")

// Create Section
exports.createSection = async (req, res) => {
  try {
    // Get data from request
    const { sectionName, courseId } = req.body

    // Data validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing properties",
      })
    }

    // Create section
    const newSection = await Section.create({
      sectionName,
    })

    // Update course with section ObjectId
    // Populate courseContent so frontend receives complete section objects
    const updateCourseDetails = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    // Return response
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updateCourseDetails,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to create section",
      error: error.message,
    })
  }
}

// Update Section
exports.updateSection = async (req, res) => {
  try {
    // Get data
    const { sectionName, sectionId } = req.body

    // Data validation
    if (!sectionName || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing properties",
      })
    }

    // Update section
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    )

    // Return response
    return res.status(200).json({
      success: true,
      message: "Section updated",
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to update section",
      error: error.message,
    })
  }
}

// Delete Section
exports.deleteSection = async (req, res) => {
  try {
    const { sectionId } = req.params

    // Find the section first
    const section = await Section.findById(sectionId)

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      })
    }

    // Delete the section
    await Section.findByIdAndDelete(sectionId)

    // Remove section ID from Course.courseContent
    const updatedCourse = await Course.findOneAndUpdate(
      { courseContent: sectionId },
      {
        $pull: {
          courseContent: sectionId,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec()

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      updatedCourse,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Unable to delete section",
      error: error.message,
    })
  }
}