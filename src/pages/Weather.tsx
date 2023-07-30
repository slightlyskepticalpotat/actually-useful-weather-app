import { makeStyles } from '@mui/styles';
import {Box, Grid, Typography} from '@mui/material';
import React, { useEffect, useState } from 'react';
import 'dotenv/config'

import COUNTRIES from '~/components/CountrySelect';
import CountryType from '~/components/CountrySelect';
import Outfit from '~/components/Outfit';

import Cloud from '@mui/icons-material/Cloud';
import Sun from '@mui/icons-material/LightMode';

import sunhat from '../images/outfits/sunhat.png';

const useStyles = makeStyles({
    root:{
        display:'flex',
        gap: '2rem',
        textAlign:'center',
        fontWeight: 500,
        fontSize: '125%',
        height: '100vh'
    },
    header:{
        fontWeight: 600,
        fontSize: '150%',
        textAlign: 'left'
    },
    rightHeader:{
      fontWeight: 700,
      fontSize: '150%',
  },
    titleBox:{
        fontWeight: 800,
        fontSize: '150%',
        textAlign: 'left',
        height: '5vh'
    },
    heading1: {
        color:'#4271e7',
        fontSize: '200%',
        textAlign: 'right'
    },
    leftSide:{
        display:'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width:'60vw',
        padding: '5rem',
        backgroundColor: '#CAF0F8',
        gap: '2rem'
    },
    homeButton:{
        width: '30%',
        padding: '1rem 2rem',
        borderRadius: '1rem',
        backgroundColor:'#158dfc'
    },
    rightSide:{
        display:'flex',
        flexDirection:'column',
        gap: '2rem',

        height: '100vh',
        width:'40vw',
        padding:'2%'
    },
    currentWeather: {
        height:'50vh',
        backgroundColor: 'white',
        padding:'3rem',

    },
    week: {
        height:'20vh',
    },
    blue: {
        backgroundColor: '#4271E7',
        color: '#FEFCFB',
        height: '100%',
        borderRadius: '5%',
        padding: '5%'
    },
    white: {
        backgroundColor: 'white',
        color: 'blue',
        height: '100%',
        borderRadius: '5%',
        padding: '5%'
    },
    iconAndTemp: {
        display:'flex',
        flexdirection: 'row',
        alignItems: 'center', 
        height: '60%',
    },
    whiteUnderline:{
        borderBottom: '0.2rem solid white',
        width: '100%',
        display: 'block'
        },
    blueUnderline: {
        borderBottom: '0.2rem solid #4271E7',
        width: '100%',
        display: 'block'    
    },
    content: {
        height:'100%',
        align:'center',
        alignItems:'center',
        padding: '1rem'
    },
    submitButton:{
      width: '30%',
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '1rem',
      backgroundColor:'#546D64',
      '&:hover': {
          backgroundColor: '#3a4742',
        }
    },
})


function convertTemperature(kelvin: number, useImperial:boolean): number {
    if(useImperial){
        return (Math.round((kelvin - 273.15) * 9/5 + 32)*10)/10
    }
    return (Math.round((kelvin - 273.15)*10)/10);
    
}

interface UserPreferences {
    'imperial': boolean;
    'commute': string;
    'light-rain': boolean;
    'heavy-rain': boolean;
    'country-code': string;
    'city': string;
  }
  

const Weather: React.FC = () => {
    const [preferences, setPreferences] = useState<UserPreferences | null>(null);
    const [useImperial, setUseImperial] = useState(false);
    const [city, setCity] = useState<string | null>(null);
    const [country, setCountry] = useState<string | null>(null);
    const [latitude, setLatitude] = useState<number | null>(43.65);

    useEffect(() => {
      // Retrieve the JSON string from localStorage
      const preferencesJSON = localStorage.getItem('userPreferences');
  
      if (preferencesJSON) {
        // Parse the JSON string back to an object
        const parsedPreferences: UserPreferences = JSON.parse(preferencesJSON);
        // setPreferences(parsedPreferences);
        const city = (parsedPreferences ? parsedPreferences.city : "Toronto")
        console.log(city)
        const country = ( parsedPreferences ? parsedPreferences['country-code'] : "CA")
        console.log(country)
        
        
        setUseImperial(parsedPreferences ? parsedPreferences.imperial :false);
      }
      const GEOAPIREQ = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + ","+ country +"&limit=5&appid=c0f957daa1315f627f7244c78fc760e7";
      console.log(GEOAPIREQ)
      
    }, []);
    


    const [weatherData, setWeatherData] = useState(null);
    
    // const [longitude, setLongitude] = useState(-79.38);
    // const latitude:number = 43.65;
    const longitude:number = -79.38;

    const classes= useStyles();
    useEffect(() => {
    const fetchWeatherData = async () => {
      try {

          
          // console.log(process.env.API_KEY)

          const APIREQ = "https://api.openweathermap.org/data/3.0/onecall?lat=" + latitude + "&lon="+ longitude + "&appid=c0f957daa1315f627f7244c78fc760e7"
          const response = await fetch(APIREQ);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const jsonData = await response.json();
  
          console.log(jsonData)
          setWeatherData(jsonData)
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          return jsonData
  
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };
    fetchWeatherData();
    // The dependency array is empty, so this effect runs only once on mount
  }, []);


    let currentTemp:number = weatherData ? weatherData["current"]["temp"]: 293;
    currentTemp = convertTemperature(currentTemp, useImperial)

    let feelsLike:number = weatherData ? weatherData["current"]["feels_like"]: 293;
    feelsLike = convertTemperature(feelsLike, useImperial)

    const titles = ['Wind', 'Humidity', 'UV', 'Pressure'];

    const uvi = weatherData ? weatherData["current"]["uvi"]:0;
    const wind = weatherData ? weatherData["current"]["wind_speed"]:0;
    const humidity = weatherData ? weatherData["current"]["humidity"]:0; 
    const pressure = weatherData ? weatherData["current"]["humidity"]:0; 
    const subtitles = [wind, humidity, uvi, pressure]

    const titleList = titles.map((title, index) => 
    {
    if (index%2===0) {
        return <Grid key = {index} item xs={3}>
        <Box sx={{
            backgroundColor: '#4271E7',
            color: 'white',
            height: '100%',
            borderRadius: '5%',
            padding: '5%'
        }}>
        <Box sx={{
            borderBottom: '0.2rem solid white',
            width: '100%',
            display: 'block'
            }}>{title}</Box>
        <Box sx={{
            height:'100%',
            align:'center',
            alignItems:'center',
            padding: '1rem'
        }}>
        <Typography align='center' alignItems='center'>{subtitles[index]}</Typography>
        </Box>
        </Box>
        </Grid>
        }
        else{
        return <Grid key = {index} item xs={3}>
            <Box sx={{
                backgroundColor: 'white',
                color: '#4271E7',
                height: '100%',
                borderRadius: '5%',
                padding: '5%'
            }}>
            <Box sx={{
                borderBottom: '0.2rem solid #4271E7',
                width: '100%',
                display: 'block'
                }}>{title}</Box>
            <Box sx={{
                height:'100%',
                align:'center',
                alignItems:'center',
                padding: '1rem'
            }}>
            <Typography color='light gray' align='center' alignItems='center' >{subtitles[index]}</Typography>
            </Box>
            </Box>
            </Grid>
        }
        }
        );

        const days = ['Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat', 'Sun'];

        const dayWeather: number[] = []
        for(let i = 0; i < 7; i++){
            if(weatherData){
                dayWeather.push(convertTemperature(weatherData["daily"][i]["temp"]["day"], useImperial))
            }   
        }
        
        const dayList = days.map((day, index) =>
        <Grid item key = {index} xs={1}>
        <Box sx={{
                backgroundColor: 'white',
                color: '#4271E7',
                height: '100%',
                borderRadius: '5%',
                padding: '5%'
            }}>
            <Box sx={{borderBottom: '0.2rem solid #4271E7',
                width: '100%',
                display: 'block' }}>{day}</Box>

                <Box sx={{
                height:'100%',
                align:'center',
                alignItems:'center',
                padding: '1rem'
            }}>
            <Typography align='center' alignItems='center'>{dayWeather[index]}°{useImperial ?"F":"C"}</Typography>
            </Box>
        </Box>
        </Grid>
        );
    return (
      <Box>
         {/* <pre>{JSON.stringify(preferences, null, 2)}</pre> */}
    <Box className={classes.root}>
        
        <Box className={classes.leftSide}>
        <Box className={classes.titleBox}>
        <Typography variant="h4">Location: {city}</Typography>
        </Box>
            <Box  className={classes.currentWeather}>
                <Box height='80%' className={classes.header}  justify-content="center">Current Weather
                    <Box height='90%' className={classes.iconAndTemp}   justifyContent="space-evenly">
                        <img width="25%" src="icons/cloud.png"></img>
                        <Box paddingBottom='3rem'>
                            <Typography color='#4271E7' alignItems='end' fontSize='300%'fontWeight='700'>{currentTemp}°{useImperial ?"F":"C"}</Typography>
                            <Typography color='gray' alignItems='end' fontSize='85%'>Feels like {feelsLike}°{useImperial ?"F":"C"}</Typography>
                        </Box>
                    </Box>
                </Box>
                <Grid container columnSpacing={5}>
                    {titleList}
                </Grid>
            </Box>

            <Grid container columns={8} className={classes.week}>
                <Grid item xs={1}>
                    <Box className={classes.blue}>
                            <Box className={classes.whiteUnderline}>Date</Box>
                        </Box>
                </Grid>
                {dayList}
                
            </Grid>
        </Box>
        <Box className={classes.rightSide}>
          <h1 className={classes.rightHeader}>Your Recommended Outfit</h1>
          <Grid container columns={2}>
          <Outfit outfitPic={sunhat} heading={"Hat"} description={"Wide-brimmed sunhat"} icon={<Sun/>} chipColor={"warning"} chipDescription={"It is sunny outside!"}/>
          <Outfit outfitPic={sunhat} heading={"Hat"} description={"Wide-brimmed sunhat"} icon={<Sun/>} chipColor={"warning"} chipDescription={"It is sunny outside!"}/>
          </Grid>
        </Box>
    </Box>
      </Box>

    );
  };
  
  export default Weather;