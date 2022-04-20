
import React,{ FC,KeyboardEvent,ChangeEvent,useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal,Button,Form,Dropdown,DropdownButton}  from 'react-bootstrap';
import { useSigma, useLoadGraph,useRegisterEvents } from 'react-sigma-v2'

import { Attributes } from "graphology-types";
import { FiltersState } from "../types";
import { parse } from 'node:path/win32';

const Info: FC<any> = (props) => {
    
  return (<div style={{"minWidth":"200px","padding":"10px","borderRadius":"10px","border":"1px solid rgb(90, 90, 90)","background":"rgb(64 64 64)","boxShadow":"rgb(0 0 0 / 88%) 4px -3px 6px 1px","color":"#ccc","display":"flex","flexDirection":"column","position":"absolute","top":"67px","left":"10px"}}>
    {props.content && props.content.map( (item:any, index:any) => {
        return (<div key={index} style={item.style}>{item.title} {item.value}</div>)
    } )}
  </div>);
}

export default Info;