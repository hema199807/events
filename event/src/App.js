import React,{useState, useEffect} from 'react';
import {format,addMonths,endOfDay, startOfHour, eachHourOfInterval ,startOfDay ,subMonths,startOfWeek,startOfMonth,endOfMonth,endOfWeek,isSameMonth,isSameDay, addHours, addMinutes, getUnixTime} from 'date-fns';
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
  const [todayDate,setTodayDate]=useState(format(currentMonth, "dd"));
  const [dateFormat,setDateFormat]=useState("MMMM yyyy");
  const [disCalender,setDisCalender]=useState("display-month");
  const [displayDayTimings,setDisplayDayTimings]=useState("hide-day");
  const [openModel,setOpenModel]=useState(false);
  const [eventTitle,setEventTitle]=useState("");
  const [eventStartTime,setEventStartTime]=useState();
  const [eventEndTime,setEventEndTime]=useState()
  const [headerCalender,setHeaderCalender]=useState(new Date().getFullYear()+"-"+(new Date().getMonth()+1));
  const [eventsArr,setEventsArr]=useState([]);
  const [count,setCount]=useState([]);

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
    getEvents();
    setRows(displayDates(currentMonth));
  }, [])

    function getEvents(){
      axios.get("http://localhost:8080/getEvent",{
        headers: {
          authorization: `bearer ${props.token.trim()}`,
        },
      }).then((response)=>{
        setEventsArr(response.data.data);
      
      })
    }
    
    

    setInterval(function(){
      
      let time=format(new Date(),"HH:mm");
  
      setPresentTime(time)
    }, 60000);
  
 

  function handleTimings(){
    let timeA=[];
    let startHour=format(startOfDay(currentMonth),"HH");
    let endHour=format(endOfDay(currentMonth),"HH");
    startHour=Number(startHour);
    endHour=Number(endHour);
    while(startHour<=endHour){
    
      let startMin=format(startOfDay(currentMonth),"mm");
      let EndMin=format(endOfDay(currentMonth),"mm");
      startMin=Number(startMin);
      EndMin=Number(EndMin);
      while(startMin<=EndMin){
        let appendzero=startMin<=9? ("0"+startMin):startMin;
        let appZ=startHour<=9?("0"+startHour):startHour;
        let disTime=appZ+":"+appendzero;
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
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "dd-MM");
        getDays.push(formattedDate);
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
    
    let updatedValue;
    
    if(typeof e.target.parentNode.childNodes[0].data =="undefined"){
      updatedValue=e.target.childNodes[0].data;
      console.log(e.target.childNodes[0].data,e.target,e)

    }else{
      let disevent=document.getElementById("hide-display-event");
      if(disevent){
      if(disevent.innerHTML!==""){
        disevent.id="display-event";
      }else{
        disevent.id="hide-display-event";
      }
      }
      updatedValue=e.target.parentNode.childNodes[0].data
      console.log(e.target.parentNode.childNodes[0].data,e,e.target)
    }
    let getcss=document.getElementsByClassName("weekdays selected");
    let sel=document.getElementsByClassName("weekdays today selected");
    if(sel.length){
      sel[0].className="weekdays today";
    }
    if(getcss.length){
      getcss[0].className="weekdays";
    }
    setSelectedDate(updatedValue);
    setEventStartTime(format(currentMonth,"yyyy-MM")+"-"+updatedValue+"T"+format(new Date(),"HH:mm"))
    setEventEndTime(format(currentMonth,"yyyy-MM")+"-"+updatedValue+"T"+(Number(format(new Date(),"HH"))+1)+":"+format(new Date(),"mm"))
    if(updatedValue===todayDate){
      if(format(new Date(),"MM")===format(m,"MM")){
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
    let dt=(Number(format(new Date(),"HH")))+1<=9?("0"+(Number(format(new Date(),"HH"))+1)):(Number(format(new Date(),"HH"))+1)
    setEventStartTime(format(currentMonth,"yyyy-MM")+"-"+dateTime+"T"+format(new Date(),"HH:mm"));
    setEventEndTime(format(currentMonth,"yyyy-MM")+"-"+dateTime+"T"+dt+":"+format(new Date(),"mm"));
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
  function handleStartEvent(e){
    setEventStartTime(e.target.value)
    let endDate=Number(e.target.value.split("T")[1].split(":")[0])+1<=9?("0"+(Number(e.target.value.split("T")[1].split(":")[0])+1)):Number(e.target.value.split("T")[1].split(":")[0])+1;
    setEventEndTime(e.target.value.split("T")[0]+"T"+endDate+":"+e.target.value.split(":")[1])
  }
  function handleEndEvent(e){
    setEventEndTime(e.target.value)
    let start=Number(e.target.value.split("T")[1].split(":")[0])-1<=9?("0"+(Number(e.target.value.split("T")[1].split(":")[0])-1)):Number(e.target.value.split("T")[1].split(":")[0])-1
    setEventStartTime(e.target.value.split("T")[0]+"T"+start+":"+e.target.value.split(":")[1])
  }
  function getItem(item){
   
    let gitem= eventsArr.filter((fItem)=>{
      if(fItem===item){
        return item;
      }
    })
  
    return gitem
    
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
        
         
          
          {rows.length&&rows.map((item)=>{
            return <div className="row"> 
            {item.props.children.length && item.props.children.map((dItem,index)=>{
              let coun=0;
              return <div 
              
              className={` weekdays ${
                dItem.split("-")[1] !== format(startOfMonth(currentMonth),"MM")
                  ? "disabled"
                  :dItem.split("-")[0]===todayDate && dItem.split("-")[1] ===format(new Date(),"MM")?"today selected":  "" 
              }`}
              
              key={dItem}
              onClick={(e) =>onDateClick(e,currentMonth)}
            >
             
              
              {eventsArr.length && eventsArr.map((item)=>{

                if((item.startTime.split("T")[0].split("-")[2])===dItem.split("-")[0]){
                  if(dItem.split("-")[1] === (item.startTime.split("T")[0].split("-")[1])){
                  coun=coun+getItem(item).length
                
                }
                }      
              
              })}
              {dItem.split("-")[0]}{coun!==0?<><span id="count">{coun}</span></>:<></>}

            </div>
            
            
            })}
            </div>
          })}
        
        </div>
    </div>
    <div id={displayDayTimings}>
       <h2 style={{textAlign:"center"}}><i className="fas fa-plus-circle day-eve" onClick={handleOpenModel}></i>Day Timings</h2>
          {timeArr.length && timeArr.map((item,index)=>{

            return <div key={index} >
              {"00"===item.split(":")[1]?item===presentTime?format(currentMonth,"MMMM")===format(new Date(),"MMMM") && selectedDate===todayDate?<div className="timeLabel">{item}<hr className="current-time"/></div>:<div className="timeLabel">{item}<hr className="time-hr" /></div>:<div className="timeLabel">{item}<hr className="time-hr" /></div>:""}
               
              {format(currentMonth,"MMMM")===format(new Date(),"MMMM")?selectedDate===todayDate?item===presentTime?"00"!==item.split(":")[1]?<div>{item}<hr className="current-time"/></div>:<></>:<></>:<></>:<></>}
              
            </div>
          })}
    </div>
    <div id="hide-display-event">
          {eventsArr.length&&eventsArr.map((item)=>{
            if(item.startTime.split("T")[0]===((format(currentMonth,"yyyy-MM"))+"-"+selectedDate)){
                return <>
                      <h4>{item.eventName}</h4>
                      <div>{item.startTime}</div>
                      <div>{item.endTime}</div>
                      </>
            }
            
            
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
          <input type="datetime-local"  value={eventStartTime} style={{marginLeft:20+"px"}} onChange={(e)=>handleStartEvent(e)} />
        </div>
        <div style={{marginTop:10+"px"}}>End:
          <input type="datetime-local"  value={eventEndTime} style={{marginLeft:20+"px"}} onChange={(e)=>handleEndEvent(e)}/>
        </div>
      <button id="add-btn" onClick={handleEvent}>Add</button>
      <button id="cancel-btn" onClick={handleCancelModel}>Cancel</button> 
      </div>      
    </Modal>
    </div>
  );
}

export default App;
