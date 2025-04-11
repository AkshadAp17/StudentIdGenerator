# Unity School ID Card Generator

## Overview
The Unity School ID Card Generator is a React-based web application designed for educational institutions to create, download, and manage student identification cards. This application allows school administrators to quickly generate professional ID cards with essential student information, including allergies and transportation details for safety purposes.

## Features

- **Complete Student Information Form**: Capture essential student details including:
  - Full Name
  - Roll Number
  - Allergies (multiple selections)
  - Student Photo Upload
  - Rack Number
  - Bus Route Number

- **Multiple ID Card Templates**:
  - Amber Classic: Traditional style with warm amber tones
  - Blue Modern: Contemporary design with cool blue aesthetics

- **QR Code Integration**:
  - Each ID card includes a scannable QR code containing essential student information
  - Interactive QR code that can be enlarged for easier scanning

- **Local Storage**:
  - Automatically saves generated ID cards for future reference
  - Retrieve previously created cards with a single click
  - Delete individual cards or clear all saved cards

- **Export Functionality**:
  - Download ID cards as PNG images for printing
  - High-quality image output suitable for standard ID card printing

## Technical Implementation

- Built with React and modern hooks (useState, useEffect, useRef)
- Uses html-to-image for high-quality PNG export
- QR code generation with qrcode.react
- Responsive design with Tailwind CSS
- Browser local storage for persistent data

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/unity-school-id-generator.git
   ```

2. Navigate to the project directory:
   ```
   cd unity-school-id-generator
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm start
   ```

5. Open your browser and visit:
   ```
   http://localhost:3000
   ```

## Usage Instructions

1. **Fill out the student information form**:
   - Enter the student's full name and roll number
   - Select any allergies from the provided options
   - Upload a student photo (optional)
   - Enter rack number and select bus route

2. **Generate ID Card**:
   - Click the "Generate ID Card" button to create the card
   - Choose between templates using the dropdown menu

3. **Download the ID Card**:
   - Click "Download as PNG" to save the ID card image
   - The file will be named according to the student's name

4. **Manage Saved Cards**:
   - Previously generated cards appear under "Saved Cards"
   - Click on any saved card to load it for viewing or modification
   - Use the delete button to remove individual cards
   - Use "Clear All" to remove all saved cards

## Browser Compatibility

The application works in all modern browsers including:
- Chrome
- Firefox
- Safari
- Edge

## Data Privacy Note

All data is stored locally in the browser's localStorage and is not transmitted to any server. The application can function entirely offline after initial load.

## License

MIT License - See LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support, email support@unityschool.edu or open an issue in the repository.
