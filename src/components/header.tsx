import React, {useState, useEffect} from 'react';
import {InputGroup,FormControl,Button } from 'react-bootstrap';

import { getJsonNode } from '../utils';


const Header : React.FC<any> = (props) => { 

    const [inputValue, setValue] = useState('');
    const [enableSearch, setEnableSearch] = useState(true);

    let inputFile = React.createRef<HTMLInputElement>();
    
    const SearchBC = async () => {
        if(!enableSearch)
        {
            alert("No puede realizar un busqueda en menos de 10 segundos.");
            return false;
        }

        if(inputValue.length != 0 && props.data.address != inputValue && enableSearch)
        {
            const data = await getJsonNode(inputValue);
            if(data.txs != null ){
                setValue('');
                props.sBC(data);
            }
            setEnableSearch(false);
            
            setTimeout(() => {
                setEnableSearch(true);
            }, 10*1000);
        }   
    };
    const ImportBC = () => {
        inputFile.current?.click();

        inputFile.current?.addEventListener('change',(e:any) => {

            let url = e.target.files[0];
            const reader = new FileReader();
            reader.onload = function() {
                props.sBC(JSON.parse(''+reader.result));

            }
            reader.readAsText(url);

        });
    }
    const ExportBC = () => {

        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
            JSON.stringify(props.sigmaData.export())
          )}`;
          const link = document.createElement("a");
          link.href = jsonString;
          link.download = "data.json";
      
          link.click();
    };

    return <>
        <header style={{position:'relative',width:'100%', height:'50px', background:'#333', color:'#fff', padding:'5px', justifyContent:'center',alignItems:'center'}}>
            <div style={{"display":"flex","flexDirection":"row","width":"100%","alignItems":"flex-start","justifyContent":"space-between"}} >

                <div>
                    <InputGroup className="mb-3" style={{width:'300px'}}>
                        <FormControl
                        placeholder="Search"
                        aria-label="Search"
                        aria-describedby="basic-addon1"
                        value={inputValue}
                        onChange={(e) => setValue(e.target.value) }
                        />
                        <Button onClick={() => { SearchBC() }}>Search</Button>
                    </InputGroup>
                </div>

                <div className="m-2">
                BitIntelligence
                </div>

                <div className="mb-3" style={{"display":"flex","flexDirection":"row","width":"209px","justifyContent":"space-evenly","alignItems":"center"}}>
                    <Button variant="success" onClick={() => ImportBC() }>Import</Button>
                    <Button variant="danger" onClick={() => ExportBC() }>Export</Button>
                </div>

            </div>
        </header>
        <input type='file' style={{display:'none'}} ref={inputFile} />
    </>
};

export default Header;