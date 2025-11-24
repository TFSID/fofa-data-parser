# FOFA Data Parser

A simple, standalone React-based web application for parsing and analyzing raw data copied from FOFA search results. FOFA is a cybersecurity search engine that helps discover internet-exposed assets. This tool takes unstructured text (e.g., copied directly from the FOFA results page) and converts it into a structured, interactive table for easier analysis.

The app runs entirely in the browser—no server required. It uses React for the UI, Tailwind CSS for styling, and regex-based parsing to extract key fields like IP, port, country, organization, and more.

<img width="1389" height="878" alt="image" src="https://github.com/user-attachments/assets/ddf989eb-6f0c-43e1-9f49-29c2b08fbad6" />


## Features

- **Raw Data Parsing**: Paste copied text from FOFA results (e.g., via Ctrl+A, Ctrl+C in the browser) and automatically extract structured data using anchors like "country" lines for reliable delimitation.
- **Interactive Table**: View parsed data in a sortable, filterable table with columns for IP, Port, Country, City, Organization, Server, Title, and Protocol.
- **Search and Filters**: 
  - Global search across IP, country, organization, domain, and title.
  - Dropdown filters for country and port (dynamically populated from parsed data).
- **Sorting**: Click column headers to sort ascending/descending (e.g., by IP, Port, Country).
- **Export to CSV**: Download filtered and sorted results as a CSV file with all extracted fields (including Region, ASN, Date, Domain, and Cloud).
- **Summary Statistics**: Quick overview of total IPs, unique countries, unique ports, and HTTPS endpoints.
- **Responsive Design**: Works on desktop and mobile with a dark-themed, gradient background using Tailwind CSS.
- **Reset and Reload**: Easily load new data or view previous results.

Extracted fields include:
- IP
- Port
- Country / Region / City
- ASN
- Organization
- Date
- Server
- Title
- Protocol (HTTP/HTTPS)
- Domain (if detected)
- Cloud (if detected, e.g., AWS, Aliyun)

## How to Use

1. **Open the App**: Save the provided HTML code as `index.html` and open it in any modern web browser (e.g., Chrome, Firefox).
2. **Paste Data**: In the textarea, paste the raw text copied from a FOFA search results page. This typically includes lines like IPs, ports, locations, and metadata.
3. **Parse**: Click "Parse Data" to process the input. The app will hide the input area and display the table.
4. **Interact**:
   - Use the search bar to filter results dynamically.
   - Select filters for country or port.
   - Sort by clicking column headers.
5. **Export**: Click "Export CSV" to download the current view as a CSV file.
6. **Load New Data**: Click "Load New Data" to reset and paste fresh input.

### Example Input
Raw FOFA data might look like this (simplified):
```
https://1.1.1.1:443
Title Here
1.1.1.1
country United States / California / San Francisco
ASN:12345
Organization:Example Org
2023-01-01
Server:nginx
```

After parsing, it becomes a row in the table with the extracted fields.

### Limitations
- Parsing relies on regex and structural assumptions from FOFA's output format. It may not handle all edge cases perfectly (e.g., unusual layouts or very large datasets).
- No external dependencies beyond CDNs (React, Babel, Tailwind)—everything loads from unpkg.com and cdn.tailwindcss.com.
- Browser-only: Large inputs may impact performance due to client-side processing.

## Development

- **Tech Stack**:
  - React 18 (via CDN)
  - Babel for JSX transpilation
  - Tailwind CSS for styling
  - Lucide icons (embedded as SVGs)
- **Customization**: Edit the HTML file directly. The main component is `FOFADataParser`.
- **Testing**: Tested with sample FOFA outputs; improve parsing logic in `parseInputData` for better accuracy if needed.

## License

MIT License. Feel free to use, modify, and distribute.

