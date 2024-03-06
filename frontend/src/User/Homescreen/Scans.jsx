import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  Select,
  MenuItem,
  FormControl,
  TextField,
  Paper,
} from '@mui/material';
import axios from 'axios';
import Loader from '../../components/Loader';
import Error from '../../components/Error';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import moment from 'moment';

function Scans() {
  const [scans, setScans] = useState([]);
  const [stypes, setStypes] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedStype, setSelectedStype] = useState('all');
  const [searchQuery, setSearchQuery] = useState(''); // State for the search query

  const user = JSON.parse(localStorage.getItem('currentuser'));

  if (!user) {
    window.location.href = '/userlog';
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch stypes
        const stypesResponse = await axios.get('http://localhost:3500/stypes');
        setStypes(stypesResponse.data);

        // Fetch scans
        const response = await axios.get('http://localhost:3500/scans/getallscans');
        const updatedScans = response.data.map(scan => {
          if (scan.scanImageURL) {
            return {
              ...scan,
              imageUrl: `data:${scan.scanImageURL.contentType};base64,${scan.scanImageURL.data}`,
            };
          }
          return scan;
        });
        setScans(updatedScans);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch scans and stypes');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  function handleDateChange(date) {
    setSelectedDate(date);
    // Perform filtering based on selected date
    // You can filter your scans here based on the selected date
  }

  function handleStypeChange(event) {
    const stype = event.target.value;
    setSelectedStype(stype);
  }

  function handleSearchChange(event) {
    const query = event.target.value;
    setSearchQuery(query);
  }

  // Filter scans based on the display property, selected stype, and search query
  const filteredScans = scans.filter(
    scan =>
      scan.display !== false &&
      (selectedStype === 'all' || scan.stype === selectedStype) &&
      scan.sname.toLowerCase().includes(searchQuery.toLowerCase()) // Case-insensitive search
  );

  return (
    <Layout>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: 3,
        marginBottom: 3,
      }}
    >
     <Paper elevation={3} sx={{ padding: 3, display: 'flex', alignItems: 'center', width: '80%', height: '60px',backgroundColor:'white' }}>

     <FormControl
  style={{ marginRight: '1rem', width: '200px', height: '50px' }}
  sx={{
    height: '40px',
    "& label.Mui-focused": {
      color: 'green', // Color when focused
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: 'green', // Underline color when focused
    },
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": {
        borderColor: 'green', // Border color when focused
      },
    },
  }}
>
  <Select
    labelId='stype-select-label'
    id='stype-select'
    value={selectedStype}
    onChange={handleStypeChange}
    sx={{
      fontSize: '0.8rem',
      padding: '0.2rem',
      height: '45px',
      maxWidth: '180px',
      color: 'green', // Color of the selected value
    }}
  >
    <MenuItem value='all'>All Types</MenuItem>
    {stypes.map((stype, index) => (
      <MenuItem key={index} value={stype.stype}>
        {stype.stype}
      </MenuItem>
    ))}
  </Select>
</FormControl>
<TextField
  id='search'
 placeholder='Search Scan'
  variant='outlined'
  value={searchQuery}
  onChange={handleSearchChange}
  sx={{
    width: '590px',
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: 'green', // Outline color
      },
      '&:hover fieldset': {
        borderColor: 'green', // Outline color on hover
      },
      '&.Mui-focused fieldset': {
        borderColor: 'green', // Outline color when focused
      },
    },
    '& input::placeholder': {
      color: 'green', // Placeholder color
    },
  }}
/>

<div style={{ display: 'inline-block', marginLeft: '1rem', width: '200px', fontSize: '1rem', color: 'green' }}>
  <DatePicker
    selected={selectedDate}
    onChange={handleDateChange}
    dateFormat='dd/MM/yyyy'
    placeholderText='Select Date'
    sx={{
      width: '100%',
      fontSize: '1rem',
      height: '100%',
      '&::placeholder': {
        color: 'green', // Placeholder text color
      },
      border: '1px solid green', // Border color
    }}
  />
</div>

      </Paper>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {loading && <Loader />}
        {error && <Error />}
        {filteredScans.map((scan, index) => (
          <Card key={index} sx={{ width: '400px', margin: 2 }}>
            <CardActionArea>
              <CardMedia
                sx={{ width: '100%', height: '200px' }}
                component='img'
                src={scan.imageUrl || ''}
                alt={scan.sname}
              />
              <CardContent>
                <Typography variant='h5' gutterBottom component='div' sx={{ fontFamily: 'cursive', color: 'green', fontWeight: 'bold' }}>
                  {scan.sname}
                </Typography>
                <Typography variant='body2' sx={{ fontFamily: 'cursive', fontWeight: 'bold' }}>
                  {scan.sdescription}
                </Typography>
                <Typography variant='body2' sx={{ fontFamily: 'cursive', fontWeight: 'bold' }}>
                  Scan Type: {scan.stype}
                </Typography>
                <Typography variant='body2' sx={{ fontFamily: 'cursive', fontWeight: 'bold' }}>
                  Scan Amount: {scan.samount}
                </Typography>
                <Link to={`/book/${scan._id}/${scan.sname}/${scan.stype}/${scan.samount}/${selectedDate}`}>
                  <Button className='btn btn-primary m-2' sx={{ color: 'green' }}>
                    Book Now
                  </Button>
                </Link>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Box>
    </Box>
    </Layout>
  );
}


export default Scans;
