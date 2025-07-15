const galleryModel = require('../models/galleryModel');
const path = require('path');

async function getGallery(req, res) {
  try {
    const images = await galleryModel.getAllImages();
    res.json(images);
  } catch (err) {
    res.status(500).json({ message: 'Failed to get gallery', error: err.message });
  }
}

async function addImage(req, res) {
  try {
    const { url, mediaType = 'image' } = req.body;
    if (!url) return res.status(400).json({ message: 'URL is required' });
    // No title required
    const imageId = await galleryModel.addImage({ url, title: '', mediaType });
    res.status(201).json({ message: 'Media added', imageId });
  } catch (err) {
    res.status(500).json({ message: 'Failed to add media', error: err.message });
  }
}

async function uploadFiles(req, res) {
  try {
    const { mediaType = 'image' } = req.body;
    const files = req.files;
    
    if (!files || files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }
    
    const results = [];
    
    for (const file of files) {
      try {
        // Create URL for the uploaded file
        const fileUrl = `/uploads/${file.filename}`;
        // No title
        const imageId = await galleryModel.addImage({ 
          url: fileUrl, 
          title: '', 
          mediaType 
        });
        
        results.push({
          originalName: file.originalname,
          filename: file.filename,
          imageId,
          success: true
        });
      } catch (error) {
        results.push({
          originalName: file.originalname,
          success: false,
          error: error.message
        });
      }
    }
    
    res.status(201).json({ 
      message: 'Files uploaded successfully', 
      results 
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to upload files', error: err.message });
  }
}

async function deleteImage(req, res) {
  try {
    const { id } = req.params;
    const deleted = await galleryModel.deleteImageById(id);
    if (!deleted) return res.status(404).json({ message: 'Media not found' });
    res.json({ message: 'Media deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete media', error: err.message });
  }
}

module.exports = { getGallery, addImage, uploadFiles, deleteImage };
