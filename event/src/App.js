import React,{useState, useEffect} from 'react';
import {format,addMonths,endOfDay, startOfHour, eachHourOfInterval ,startOfDay ,subMonths,startOfWeek,startOfMonth,endOfMonth,endOfWeek,isSameMonth,isSameDay, addHours, addMinutes} from 'date-fns';
import addDays from 'date-fns/addDays';
import Modal from 'react-modal';
import './App.css';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

const customStyles = {
  content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      padding: '3px',
      backgroundColor:"white",
      border: 'solid 2px brown',
      width: '64%',
      height: '62%',
  }
};

function App(props) {
  const [currentMonth,setCurrentMonth]=useState(new Date());
  const [selectedDate,setSelectedDate]=useState(new Date());
  const [days,setDays]=useState([]);
  const [rows,setRows]=useState([]);
  const [timeArr,setTimeArr]=useState([]);
  const [presentTime,setPresentTime]=useState("");
  const [todayDate,setTodayDate]=useState(format(currentMonth, "d"));
  const [dateFormat,setDateFormat]=useState("MMMM yyyy");
  const [disCalender,setDisCalender]=useState("display-month");
  const [displayDayTimings,setDisplayDayTimings]=useState("hide-day");
  const [openModel,setOpenModel]=useState(false);
  const [eventTitle,setEventTitle]=useState("");
  const [eventStartTime,setEventStartTime]=useState(format(new Date(),"yyyy-MM-dd")+"T"+format(new Date(),"HH:mm"));
  const [eventEndTime,setEventEndTime]=useState(format(new Date(),"yyyy-MM-dd")+"T"+(Number(format(new Date(),"HH"))+1)+":"+format(new Date(),"mm"))
  const [headerCalender,setHeaderCalender]=useState(new Date().getFullYear()+"-"+(new Date().getMonth()+1));
  const [eventsArr,setEventsArr]=useState([]);

  useEffect(() => {
   
    let startdate=startOfWeek(currentMonth);
    let mArr=[];
    for(let i=0;i<7;i++){
      let addDay=addDays(startdate,i);
      addDay=String(addDay);
      mArr.push(addDay.split(" ")[0]);
    }
    setDays(mArr);
    handleTimings(); 
    let time=format(new Date(),"HH:mm");
    setPresentTime(time)
    setRows(displayDates(currentMonth));
    getEvents();

  }, [])

    function getEvents(){
      axios.get("http://localhost:8080/getEvent",{
        headers: {
          authorization: `bearer ${props.token.trim()}`,
        },
      }).then((response)=>{
        console.log(response.data.data)
        setEventsArr(response.data.data);
      })
    }
   
    setInterval(function(){
    
      let time=format(new Date(),"HH:mm");
  
      setPresentTime(time)
    }, 60000);
  
 

  function handleTimings(){
    let timeA=[];
    let startHour=format(startOfDay(new Date()),"HH");
    let endHour=format(endOfDay(new Date()),"HH")
    startHour=Number(startHour);
    endHour=Number(endHour);
    while(startHour<=endHour){
    
      let startMin=format(startOfDay(new Date()),"mm");
      let EndMin=format(endOfDay(new Date()),"mm");
      startMin=Number(startMin);
      EndMin=Number(EndMin);
      while(startMin<=EndMin){
        let appendzero=startMin<9? ("0"+startMin):startMin;
        let disTime=startHour+":"+appendzero;
        startMin=startMin+1
        timeA.push(disTime);
      }
      startHour=startHour+1;
    }
    
    setTimeArr(timeA);
  }

  function displayDates(getMonth){
    const monthStart =startOfMonth(getMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    let getDays = [];
    let day = startDate;
    let formattedDate = "";
    let displayDates=[];
    let count=0;
    let c=eventsArr.filter((item)=>{
      if(item.startTime.split("T")[0]===format(getMonth,"yyyy-MM-dd")){
         return item;
      }
    })
    console.log(c.length)
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        getDays.push(
          <div 
            className={` weekdays ${
              !isSameMonth(day, monthStart)
                ? "disabled"
                :isSameDay(day, new Date())?"today selected":  "" 
            }`}
            
            key={day}
            onClick={(e) =>onDateClick(e,getMonth)}
          >
            {formattedDate}
            
          </div> 
         
        );
        day = addDays(day, 1);
      }
      displayDates.push(
        <div className="row" key={day}>
          {getDays}
        </div>
      );
      getDays = [];
    }
   
    return displayDates;
  }
  function onDateClick(e,m){
    let getcss=document.getElementsByClassName("weekdays selected");
    let sel=document.getElementsByClassName("weekdays today selected");
    if(sel.length){
      sel[0].className="weekdays today";
    }
    if(getcss.length){
      getcss[0].className="weekdays";
    }
    setSelectedDate(e.target.innerText);
    setEventStartTime(format(currentMonth,"yyyy-MM")+"-"+e.target.innerText+"T"+format(new Date(),"HH:mm"))
    setEventEndTime(format(currentMonth,"yyyy-MM")+"-"+e.target.innerText+"T"+(Number(format(new Date(),"HH"))+1)+":"+format(new Date(),"mm"))
    if(e.target.innerText===todayDate){
      if(format(new Date(),"MMMM")===format(m,"MMMM")){
        e.target.className="weekdays today selected"
      }else{
        e.target.className="weekdays selected"
      }
    }else{
      e.target.className="weekdays selected"
    }
    setDisplayDayTimings("display-day")
  }
  function handleNextMonth(){
    setCurrentMonth(addMonths(currentMonth,1));
    setRows(displayDates(addMonths(currentMonth,1)));
    setDisplayDayTimings("hide-day")
  } 
  
  function handlePrevMonth(){
    setCurrentMonth(subMonths(currentMonth,1));
    setRows(displayDates(subMonths(currentMonth,1)));
    setDisplayDayTimings("hide-day")
  }
  function handleChangeCurrentMonth(e){
    setCurrentMonth(new Date(e.target.value.split("-")[0],(e.target.value.split("-")[1]-1)))
    setRows(displayDates(new Date(e.target.value.split("-")[0],(e.target.value.split("-")[1]-1))))
  }
  function handleGetCalender(){
    setDisCalender("dis-month");
  }
  function closeCalender(){
    setDisCalender("display-month");
  }
  function handleOpenModel(){
    let dateTime=Number(selectedDate)<=9? "0"+Number(selectedDate):selectedDate;
    setEventStartTime(format(currentMonth,"yyyy-MM")+"-"+dateTime+"T"+format(new Date(),"HH:mm"));
    setEventEndTime(format(currentMonth,"yyyy-MM")+"-"+dateTime+"T"+(Number(format(new Date(),"HH"))+1)+":"+format(new Date(),"mm"));
    setOpenModel(true);
  }
  function handleCancelModel(){
    setEventTitle("");
    setEventStartTime("");
    setEventEndTime("");
    setOpenModel(false);
  }
  function handleEvent(){
    if(eventTitle===""){
      setEventTitle("My Event");
    }
    if(eventStartTime===""){
      setEventStartTime(format(new Date(),"yyyy-MM-dd")+"T"+format(new Date(),"HH:mm"));
    }
    if(eventEndTime===""){
      setEventEndTime(format(new Date(),"yyyy-MM-dd")+"T"+(Number(format(new Date(),"HH"))+1)+":"+format(new Date(),"mm"));
    }
    const obj={
      "eventName":eventTitle.trim()==="" ? "My Event" :eventTitle.trim(),
      "startTime":eventStartTime.trim()==="" ? format(new Date(),"yyyy-MM-dd")+"T"+format(new Date(),"HH:mm"):eventStartTime.trim(),
      "endTime":eventEndTime.trim()==="" ? format(new Date(),"yyyy-MM-dd")+"T"+(Number(format(new Date(),"HH"))+1)+":"+format(new Date(),"mm"):eventEndTime.trim()
    }

    axios({
      method:'POST',
      url:'http://localhost:8080/postEvent',
      headers:{authorization: `bearer ${props.token.trim()}`},
      data:obj
    }).then((response)=>{
      if(response.data.message==='Event added successfully'){
        alert(response.data.message)
        setEventTitle("");
        setEventStartTime("");
        setEventEndTime("");
        setOpenModel(false);
        getEvents();
      }

    })
  }

  return (
    <div>
    <div id="calender">
        <div id="calender-header">
          <div id="prev-btn" onClick={handlePrevMonth}><i className="fas fa-chevron-left"></i></div>
          <div id="current-month" onClick={handleGetCalender}>{format(currentMonth,dateFormat)}</div>
          <div id="next-btn" onClick={handleNextMonth}><i className="fas fa-chevron-right"></i></div>
        </div>
        <div id={disCalender}>
          <button className="btn btn-sm btn-danger" style={{ float: 'right',height: 28+"px",marginRight: 274+"px"}} 
          onClick={closeCalender}>❌</button>
          <input type="month" name="month" id="dis-input" value={headerCalender}
          onChange={(e)=>setHeaderCalender(e.target.value,e.target.value!==""&&handleChangeCurrentMonth(e))}/>
        </div>
        <div id="calender-days" >
          {days.length&& days.map((item,index)=>{
            return <div key={index} id="weekNames">{item}</div>
          })}
        </div>
        <div id="calender-dates">
            {rows}
        </div>
    </div>
    <div id={displayDayTimings}>
       <h2 style={{textAlign:"center"}}><i className="fas fa-plus-circle day-eve" onClick={handleOpenModel}></i>Day Timings</h2>
          {timeArr.length && timeArr.map((item,index)=>{

            return <div key={index} >
              {"00"===item.split(":")[1]?item===presentTime?selectedDate===todayDate?<div className="timeLabel">{item}<hr className="current-time"/></div>:<div className="timeLabel">{item}<hr className="time-hr" /></div>:<div className="timeLabel">{item}<hr className="time-hr" /></div>:""}
           
            
            {selectedDate===todayDate?item===presentTime?item.split(":")[1]!=="00"?<div>{item}<hr className="current-time"/></div>:<></>:<></>:<></>}
            </div>
          })}
    </div>
    <Modal
      isOpen={openModel}
      style={customStyles}
      ariaHideApp={false}
    >
      
      <div style={{padding:20+"px",textAlign:"center"}}>
        <h3>Event</h3>
        <div>
          Title:
          <input type="text" id="event-title" style={{marginLeft:20+"px"}} value={eventTitle}
          onChange={(e)=>setEventTitle(e.target.value)}
          onKeyUp={(e)=> e.code==="Enter"?handleEvent():""}/> 
        </div>
        <div style={{marginTop:10+"px"}}>Start:
          <input type="datetime-local" max={eventStartTime.split("T")[0]} value={eventStartTime} style={{marginLeft:20+"px"}} onChange={(e)=>setEventStartTime(e.target.value)} />
        </div>
        <div style={{marginTop:10+"px"}}>End:
          <input type="datetime-local" min={eventEndTime.split("T")[0]} value={eventEndTime} style={{marginLeft:20+"px"}} onChange={(e)=>setEventEndTime(e.target.value)}/>
        </div>
      <button id="add-btn" onClick={handleEvent}>Add</button>
      <button id="cancel-btn" onClick={handleCancelModel}>Cancel</button> 
      </div>      
    </Modal>
    </div>
  );
}

export default App;
