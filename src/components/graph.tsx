import React,{ ReactNode, useEffect, useState, useRef } from 'react';
import ReactDOM from "react-dom";
import {formatMoneyToBTC} from '../utils';

import Info from './info';

import erdosRenyi from "graphology-generators/random/erdos-renyi";
import forceAtlas2 from 'graphology-layout-forceatlas2';

import { useSigma, useLoadGraph, useRegisterEvents,SigmaContainer } from 'react-sigma-v2';
import { DirectedGraph,UndirectedGraph } from 'graphology';
import PropTypes,{ func } from 'prop-types';
import { Modal, Button, Form, Dropdown, DropdownButton, Tooltip,OverlayTrigger } from 'react-bootstrap';
import { FlowType, PropertySignature, StringLiteralLike, updateTypePredicateNodeWithModifier } from 'typescript';

import { getRandomPosition, getJsonNode } from '../utils';
import { Attributes } from 'graphology-types';

const Graph: React.FC<any> = (props) => {
  
  const data = props.data;
  const sigma = useSigma();
  const loadGraph = useLoadGraph();
  const registerEvents = useRegisterEvents();

  const [showInfoModal, setToggleInfo] = useState(false);
  const [currentNode, setCurrentNode] = useState(data.address);
  const [textInput, setTextInput] = useState(currentNode);
  const [enableSearch, setEnableSearch] = useState(true);

  useEffect(() => {
 
    let graph = new DirectedGraph();

    if(graph.nodes.length != 0)
      graph.clear();

    if(data.address != null){
      graph.addNode(data.address, { label: data.address, x: 0, y: 0, color: "#0d6efd", size: 5, total_received: formatMoneyToBTC(data.total_received), total_sent: formatMoneyToBTC(data.total_sent), final_balance: formatMoneyToBTC(data.final_balance), total_txs: data.n_tx, firstnode: true });
      for (let tx of data.txs) {
        for (let input of tx.inputs) {
            if (!graph.hasNode(input.prev_out.addr)) {
              const pos = getRandomPosition();
              graph.addNode(input.prev_out.addr, { label: input.prev_out.addr, money: input.prev_out.value, spent: input.prev_out.spent, is_output:false, is_input:true, size: 5 ,...pos });
            }
            if (!graph.hasEdge(data.address, input.prev_out.addr)) {
              graph.addEdge(data.address, input.prev_out.addr, { color: "#36E51E", size: 1 });
            }
        }
        for (let out of tx.out) {
          if (!graph.hasNode(out.addr)) {
            const pos = getRandomPosition();
            graph.addNode(out.addr, { label: out.addr, money: out.value,spent: out.spent, is_input:false, is_output:true, size: 5 ,...pos });
          }
          if (!graph.hasEdge(data.address, out.addr)) {
            graph.addEdge(data.address, out.addr, { color: "#E51E1E", size: 1 });
          }
        }
      }
    }else{
      data.nodes.map( (node:any, index:number) => {
        if(node.attributes.firstnode != null && node.attributes.firstnode)
          graph.addNode(node.key, node.attributes);
        
        if (!graph.hasNode(node.key)) {
          const pos = getRandomPosition();
          graph.addNode(node.key, node.attributes);
        }
      });
      data.edges.map( (edge:any, index:number) => {
        if (!graph.hasEdge(edge.source, edge.target)) {
          graph.addEdge(edge.source, edge.target, edge.attributes);
        }
      });
    }
    loadGraph(graph);

    registerEvents({
      clickNode(node) {
        setTextInput('');
        setCurrentNode(node.node);
        sigma.getViewportZoomedState({ x: 0, y: 0 }, 1000);
        setToggleInfo(true);
      },
    });

    props.sCS(sigma.getGraph());

  }, [data]);

  async function setNode(node:any)
  {
    if(!enableSearch)
    {
        alert("No puede realizar un busqueda en menos de 10 segundos.");
        return false;
    }

    const graph = sigma.getGraph();
    const _data = await getJsonNode(node);
    if(_data.txs != null ){
      props.sBC(_data);
      setToggleInfo(false);
    }
    setEnableSearch(false);
    setTimeout(() => {
      setEnableSearch(true);
  }, 10*1000);
  }
  function updateNode(node:any) {
    const graph = sigma.getGraph();
    const value = textInput;
    const attrs = sigma.getGraph().getNodeAttributes(node);

    if (value != "" && value != node) 
      graph.updateNode(node, Attr => { return { ...Attr, label: value, color:  (attrs.firstnode != null && attrs.firstnode) ? '#0d6efd' : "#02ee5a" }; });
      
    setToggleInfo(false);
    setTextInput('');
    props.sCS(sigma.getGraph());
  }

  function level(node:any,lvl: number) {
    const graph = sigma.getGraph();
    let color: string;
    let size: number;
    if (lvl == 0) {
      color = "#CCC";
      size = 10;
    } else if (lvl == 1) {
      color = "#FF0";
      size = 15;
    } else if (lvl == 2) {
      color = "#ff8805"
      size = 20;
    } else {
      color = "#ff0000";
      size = 25;
    }
    graph.updateNode(node, Attr => { return { ...Attr, color: color, size: size }; });
  }


  const itemGraphAttr = () => { return (sigma.getGraph().hasNode(currentNode)) ? sigma.getGraph().getNodeAttributes(currentNode) : {}};
  const itemDataNode =  (addr:string) => { 
    if(data.address == null)
    {
      return data.edges.map( (node: any, index:number) => { if(node.source == addr || node.target == addr){ return node }  });
    }else return data.txs.map((val:any,idx:any) => {  val.out.map( (val2:any,idx2:any) => { if(val2.addr == addr){ return val2 }  })}) 
  }

  let inputs: number = 0;
  let outputs: number = 0;
  sigma.getGraph().forEachNode((key: string, attributes: Attributes): void => {

      if(attributes.is_input){
        inputs++;
      }else if(attributes.is_output){
        outputs++;
      }
  });
  let contentInfo = [];
  contentInfo.push({ title:'Total Inputs:',value: inputs,style:{color:'#0AE82F', fontWeight:'bold'} });
  contentInfo.push({ title:'Total Outputs:',value: outputs,style:{color:'#E80A0A', fontWeight:'bold'} });
  

  const tooltipApplyNode = (props:any) => (
    <Tooltip id="ApplyNodeTip" {...props}>
      Point of origen
      will change!
    </Tooltip>
  );

  return <div>
    <Info content={contentInfo} />
    <Modal show={showInfoModal}>
      <Modal.Header closeButton onClick={() => setToggleInfo(false)}>
        <Modal.Title>Modal Node Info</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>

        <Form.Label htmlFor="inputNameNode">Name Node</Form.Label>
        <Form.Control type="text" value={ (textInput.length != 0) ? textInput : itemGraphAttr().label} onChange={(e) => { setTextInput(e.target.value) }} aria-describedby="nameNode" />

        <Form.Label >{"Adress: " + currentNode}</Form.Label><br></br>
        {(itemGraphAttr().firstnode) ? <><Form.Label >{'Total Received: ' + itemGraphAttr().total_received}</Form.Label><br></br></> : null}
        {(itemGraphAttr().firstnode) ? <><Form.Label >{'Total Sent: ' + itemGraphAttr().total_sent}</Form.Label><br></br></> : null}
        {(itemGraphAttr().firstnode) ? <><Form.Label >{'Balance: ' + itemGraphAttr().final_balance}</Form.Label><br></br></> : null}
        {(itemGraphAttr().firstnode) ? <><Form.Label >{'Total Transactions: ' + itemGraphAttr().total_txs}</Form.Label><br></br></> : null}

        {(itemGraphAttr().is_input != null) ? <><Form.Label >{'Type: '+ ((itemGraphAttr().is_input) ? 'Input' : 'Output')} </Form.Label><br></br></> : null }
        {(itemGraphAttr().spent != null) ? <><Form.Label >{'Spent: '+ ((itemGraphAttr().spent) ? 'Yes' : 'No')} </Form.Label><br></br></> : null }
        {(itemGraphAttr().money != null) ? <><Form.Label >{'Total Money: '+ formatMoneyToBTC(itemGraphAttr().money)}</Form.Label><br></br></> : null }


        <Form.Text>
          <br></br>
          <br></br>
        </Form.Text>

        <DropdownButton id="drop" title="Categories" onSelect={ (e:any) => { if(e != null)level(currentNode,parseInt(e)) } }>
          <Dropdown.Item eventKey={0}>Level 0</Dropdown.Item>
          <Dropdown.Item eventKey={1}>Level 1</Dropdown.Item>
          <Dropdown.Item eventKey={2}>Level 2</Dropdown.Item>
          <Dropdown.Item eventKey={3}>Level 3</Dropdown.Item>
        </DropdownButton>
      </Modal.Body>

      <Modal.Footer>
      <OverlayTrigger
          placement="right"
          delay={{ show: 250, hide: 400 }}
          overlay={tooltipApplyNode}
          >
        <Button variant="dark" onClick={() => setNode(currentNode) }>Apply Node</Button>
        </OverlayTrigger>
        <Button variant="secondary" onClick={() => setToggleInfo(false)}>Close</Button>
        <Button variant="primary" onClick={() => updateNode(currentNode)}>Save changes</Button>
      </Modal.Footer>
    </Modal>
  </div>;
}
export default Graph;
