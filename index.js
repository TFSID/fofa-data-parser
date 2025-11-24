import React, { useState, useMemo } from 'react';
import { Download, Search, Filter, SortAsc, SortDesc } from 'lucide-react';

const FOFADataParser = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [filterCountry, setFilterCountry] = useState('');
  const [filterPort, setFilterPort] = useState('');
  const [rawInput, setRawInput] = useState('');
  const [showInput, setShowInput] = useState(true);
  const [parsedData, setParsedData] = useState([]);

  // Initial sample data
  const sampleData = [
    {
      ip: '31.58.220.66',
      port: '8080',
      country: 'Iran (Islamic Republic of)',
      region: 'Semnan',
      city: 'Shahrud',
      asn: '56971',
      organization: 'Cgi Global Limited',
      date: '2025-11-23',
      server: '',
      title: '',
      protocol: 'HTTP/1.1'
    },
    {
      ip: '51.84.170.231',
      port: '646',
      country: 'Israel',
      region: 'Tel Aviv',
      city: 'Tel Aviv',
      asn: '16509',
      organization: 'AMAZON-02',
      date: '2025-11-23',
      server: '',
      title: 'Please login',
      protocol: 'HTTP/1.1',
      cloud: 'aws'
    },
    {
      ip: '16.62.77.105',
      port: '32',
      country: 'Switzerland',
      region: 'Zurich',
      city: 'Zurich',
      asn: '16509',
      organization: 'AMAZON-02',
      date: '2025-11-23',
      server: '',
      title: 'Please login',
      protocol: 'HTTP/1.1',
      cloud: 'aws'
    },
    {
      ip: '212.94.40.19',
      port: '443',
      country: 'Switzerland',
      region: 'Zug',
      city: 'Baar',
      asn: '28859',
      organization: 'Convotis Schweiz AG',
      date: '2025-11-23',
      server: 'Apache/2.4.52 (Ubuntu)',
      title: 'Home - IT-Lösungen für KMU',
      protocol: 'HTTPS',
      domain: 'combined.swiss'
    },
    {
      ip: '193.110.137.164',
      port: '443',
      country: 'Poland',
      region: 'Mazowieckie',
      city: 'Warsaw',
      asn: '24597',
      organization: 'Instytut Lacznosci',
      date: '2025-11-23',
      server: '',
      title: '',
      protocol: 'HTTPS'
    },
    {
      ip: '13.61.6.44',
      port: '2406',
      country: 'United States of America',
      region: 'Washington',
      city: 'Seattle',
      asn: '16509',
      organization: 'AMAZON-02',
      date: '2025-11-23',
      server: '',
      title: 'Please login',
      protocol: 'HTTP/1.1'
    },
    {
      ip: '103.126.83.2',
      port: '8080',
      country: 'Indonesia',
      region: 'Jawa Tengah',
      city: 'Kalimantan',
      asn: '55687',
      organization: 'Universitas Tanjungpura',
      date: '2025-11-23',
      server: '',
      title: '',
      protocol: 'HTTPS'
    },
    {
      ip: '104.18.15.143',
      port: '80',
      country: 'United States of America',
      region: 'California',
      city: 'San Francisco',
      asn: '13335',
      organization: 'CLOUDFLARENET',
      date: '2025-11-23',
      server: 'cloudflare',
      title: 'Fortinet Network Security Solutions',
      protocol: 'HTTP/1.1',
      cloud: 'Cloudflare',
      domain: 'avfirewalls.com'
    },
    {
      ip: '104.18.14.143',
      port: '443',
      country: 'United States of America',
      region: 'California',
      city: 'San Francisco',
      asn: '13335',
      organization: 'CLOUDFLARENET',
      date: '2025-11-23',
      server: 'cloudflare',
      title: 'Fortinet Network Security Solutions',
      protocol: 'HTTPS',
      cloud: 'Cloudflare',
      domain: 'avfirewalls.com'
    }
  ];

  // Parse FOFA data from raw text input
  const parseInputData = (input) => {
    const parsed = [];
    const lines = input.split('\n');
    
    let currentEntry = {};
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Detect IP:Port entries
      const ipPortMatch = line.match(/^([\d.]+):(\d+)/);
      if (ipPortMatch) {
        if (Object.keys(currentEntry).length > 0) {
          parsed.push({...currentEntry});
        }
        currentEntry = {
          ip: ipPortMatch[1],
          port: ipPortMatch[2],
          country: '',
          region: '',
          city: '',
          asn: '',
          organization: '',
          date: '',
          server: '',
          title: '',
          protocol: 'HTTP/1.1',
          domain: '',
          cloud: ''
        };
        continue;
      }
      
      // Extract country, region, city
      if (line.startsWith('country ')) {
        const parts = line.replace('country ', '').split(' / ');
        if (parts.length >= 1) currentEntry.country = parts[0];
        if (parts.length >= 2) currentEntry.region = parts[1];
        if (parts.length >= 3) currentEntry.city = parts[2];
        continue;
      }
      
      // Extract ASN
      if (line.startsWith('ASN: ')) {
        currentEntry.asn = line.replace('ASN: ', '');
        continue;
      }
      
      // Extract Organization
      if (line.startsWith('Organization: ')) {
        currentEntry.organization = line.replace('Organization: ', '');
        continue;
      }
      
      // Extract date
      if (line.match(/^\d{4}-\d{2}-\d{2}$/)) {
        currentEntry.date = line;
        continue;
      }
      
      // Extract server
      if (line.startsWith('Server: ')) {
        currentEntry.server = line.replace('Server: ', '');
        continue;
      }
      
      // Extract domain
      const domainMatch = line.match(/https?:\/\/([\w.-]+)/);
      if (domainMatch && !currentEntry.domain) {
        currentEntry.domain = domainMatch[1];
        if (line.includes('https://')) {
          currentEntry.protocol = 'HTTPS';
        }
        continue;
      }
      
      // Extract cloud name
      if (line === 'CloudName') {
        const nextLine = lines[i + 1]?.trim();
        if (nextLine) {
          currentEntry.cloud = nextLine;
          i++;
        }
        continue;
      }
      
      // Extract title (usually follows domain or appears as a standalone line)
      if (line.length > 5 && line.length < 200 && !line.includes('HTTP/') && !line.includes('country') && !line.includes(':') && !line.match(/^\d/) && currentEntry.ip && !currentEntry.title) {
        currentEntry.title = line;
      }
    }
    
    // Add last entry
    if (Object.keys(currentEntry).length > 0) {
      parsed.push({...currentEntry});
    }
    
    return parsed;
  };

  const handleParseData = () => {
    if (rawInput.trim()) {
      const newData = parseInputData(rawInput);
      setParsedData(newData);
      setShowInput(false);
      setSearchTerm('');
      setFilterCountry('');
      setFilterPort('');
    }
  };

  const handleReset = () => {
    setParsedData(sampleData);
    setRawInput('');
    setShowInput(true);
  };

  const rawData = parsedData.length > 0 ? parsedData : sampleData;

  const filteredAndSortedData = useMemo(() => {
    let filtered = rawData.filter(item => {
      const matchesSearch = 
        item.ip.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.domain || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.title || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCountry = !filterCountry || item.country.includes(filterCountry);
      const matchesPort = !filterPort || item.port === filterPort;
      
      return matchesSearch && matchesCountry && matchesPort;
    });

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a[sortConfig.key] || '';
        const bVal = b[sortConfig.key] || '';
        
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }, [searchTerm, filterCountry, filterPort, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const exportToCSV = () => {
    const headers = ['IP', 'Port', 'Country', 'Region', 'City', 'ASN', 'Organization', 'Date', 'Server', 'Title', 'Protocol', 'Domain', 'Cloud'];
    const rows = filteredAndSortedData.map(item => [
      item.ip,
      item.port,
      item.country,
      item.region,
      item.city,
      item.asn,
      item.organization,
      item.date,
      item.server || '',
      item.title || '',
      item.protocol,
      item.domain || '',
      item.cloud || ''
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fofa_data_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const uniqueCountries = [...new Set(rawData.map(item => item.country))];
  const uniquePorts = [...new Set(rawData.map(item => item.port))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">FOFA Data Parser & Analyzer</h1>
          <p className="text-blue-200">Analyze network security scan results with filtering and export capabilities</p>
        </div>

        {showInput && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-white mb-4">Paste FOFA Data</h2>
            <p className="text-blue-200 mb-4">Paste your raw FOFA scan results below to parse and analyze the data</p>
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              placeholder="Paste FOFA data here (e.g., IP:Port entries with country, ASN, organization info)..."
              className="w-full h-64 px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 font-mono text-sm"
            />
            <div className="mt-4 flex gap-4">
              <button
                onClick={handleParseData}
                disabled={!rawInput.trim()}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors shadow-lg font-semibold"
              >
                Parse Data
              </button>
              {parsedData.length > 0 && (
                <button
                  onClick={() => setShowInput(false)}
                  className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors shadow-lg"
                >
                  View Current Data
                </button>
              )}
            </div>
          </div>
        )}

        {!showInput && (
          <>
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    <Search className="inline w-4 h-4 mr-2" />
                    Search
                  </label>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search IP, country, organization, domain..."
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    <Filter className="inline w-4 h-4 mr-2" />
                    Filter by Country
                  </label>
                  <select
                    value={filterCountry}
                    onChange={(e) => setFilterCountry(e.target.value)}
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">All Countries</option>
                    {uniqueCountries.map(country => (
                      <option key={country} value={country} className="bg-slate-800">{country}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-2">
                    <Filter className="inline w-4 h-4 mr-2" />
                    Filter by Port
                  </label>
                  <select
                    value={filterPort}
                    onChange={(e) => setFilterPort(e.target.value)}
                    className="w-full px-4 py-2 bg-white/20 border border-white/30 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="">All Ports</option>
                    {uniquePorts.sort((a, b) => parseInt(a) - parseInt(b)).map(port => (
                      <option key={port} value={port} className="bg-slate-800">{port}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="text-blue-200">
                    Showing <span className="font-bold text-white">{filteredAndSortedData.length}</span> of <span className="font-bold text-white">{rawData.length}</span> results
                  </div>
                  <button
                    onClick={() => setShowInput(true)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors shadow-lg text-sm"
                  >
                    Load New Data
                  </button>
                </div>
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg"
                >
                  <Download className="w-4 h-4" />
                  Export CSV
                </button>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-white/20">
                    <tr>
                      {['IP', 'Port', 'Country', 'City', 'Organization', 'Server', 'Title', 'Protocol'].map(header => (
                        <th
                          key={header}
                          onClick={() => handleSort(header.toLowerCase())}
                          className="px-4 py-3 text-left text-sm font-semibold text-white cursor-pointer hover:bg-white/30 transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            {header}
                            {sortConfig.key === header.toLowerCase() && (
                              sortConfig.direction === 'asc' ? 
                                <SortAsc className="w-4 h-4" /> : 
                                <SortDesc className="w-4 h-4" />
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredAndSortedData.map((item, idx) => (
                      <tr key={idx} className="hover:bg-white/10 transition-colors">
                        <td className="px-4 py-3 text-sm text-blue-100 font-mono">{item.ip}</td>
                        <td className="px-4 py-3 text-sm text-blue-100">
                          <span className="px-2 py-1 bg-blue-600/40 rounded">{item.port}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-blue-100">{item.country}</td>
                        <td className="px-4 py-3 text-sm text-blue-100">{item.city}</td>
                        <td className="px-4 py-3 text-sm text-blue-100">{item.organization}</td>
                        <td className="px-4 py-3 text-sm text-blue-100">
                          {item.server && <span className="px-2 py-1 bg-green-600/40 rounded text-xs">{item.server}</span>}
                        </td>
                        <td className="px-4 py-3 text-sm text-blue-100 max-w-xs truncate">{item.title}</td>
                        <td className="px-4 py-3 text-sm text-blue-100">
                          <span className={`px-2 py-1 rounded text-xs ${item.protocol.includes('HTTPS') ? 'bg-green-600/40' : 'bg-yellow-600/40'}`}>
                            {item.protocol}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Summary Statistics</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="text-blue-200 text-sm">Total IPs</div>
                  <div className="text-white text-2xl font-bold">{rawData.length}</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="text-blue-200 text-sm">Unique Countries</div>
                  <div className="text-white text-2xl font-bold">{uniqueCountries.length}</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="text-blue-200 text-sm">Unique Ports</div>
                  <div className="text-white text-2xl font-bold">{uniquePorts.length}</div>
                </div>
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="text-blue-200 text-sm">HTTPS Endpoints</div>
                  <div className="text-white text-2xl font-bold">
                    {rawData.filter(item => item.protocol.includes('HTTPS')).length}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FOFADataParser;