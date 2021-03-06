import React from "react";
import {Input,Button,Row,Table} from 'react-materialize';

//ACTION
import * as StrandAction from "../../Actions/StrandAction";

//STORE
import toolsAnalysisStore from "../../Store/toolsAnalysisStore";


export default class StrandComparer extends React.Component {

	constructor()
	{
		super();

		this.state = {
			output:toolsAnalysisStore.get_Compare_Results() , 
			name1:"A",
			sequence1:"",
			fiveprime1:"5' to 3'",
			name2:"B",
			sequence2:"",
			fiveprime2:"3' to 5'"
		}
		this.updateresults = this.updateresults.bind(this);
		this.handleprime = this.handleprime.bind(this);
		this.handlename = this.handlename.bind(this);
		this.mismatchfunction = this.mismatchfunction.bind(this);
		this.handlename2 = this.handlename2.bind(this);
		this.handleinput = this.handleinput.bind(this);
		this.handleinput2 = this.handleinput2.bind(this);
		this.clear = this.clear.bind(this);
		this._handleKeyPress = this._handleKeyPress.bind(this);
	}
	componentWillMount() 
	{
		toolsAnalysisStore.on("Update_ToolsAnalysis_Compare",this.updateresults);		
	}
	componentWillUnmount() 
	{
		toolsAnalysisStore.removeListener("Update_ToolsAnalysis_Compare",this.updateresults);	
	}
	//
	updateresults()
	{
		this.setState({ output:toolsAnalysisStore.get_Compare_Results()	});
	}
	//


	//

	handlename(e)
	{
		if(e.target.value == "")
			this.setState({ name1:"A"});
		else
			this.setState({ name1:e.target.value});

	}
	handlename2(e)
	{
		if(e.target.value == "")
			this.setState({ name2:"B"});
		else
			this.setState({ name2:e.target.value});
	}
	handleinput(e)
	{
		this.setState({sequence1:e.target.value});	
	}
	handleinput2(e)
	{
		this.setState({sequence2:e.target.value});	
	}
	handleprime(f)
	{
		if(f.target.value == 1)
			this.state.fiveprime1 = "5' to 3'";
		else if(f.target.value == 2)
			this.state.fiveprime1 = "3' to 5'";
		else if(f.target.value == 3)
			this.state.fiveprime1 = "loop";
		else if(f.target.value == 4)
			this.state.fiveprime2 = "5' to 3'";
		else if(f.target.value == 5)
			this.state.fiveprime2 = "3' to 5'";
		else if(f.target.value == 6)
			this.state.fiveprime2 = "loop";
	}

	clear()
	{
		this.setState({
			name1:"",
			sequence1:"",
			fiveprime1:"true",
			name2:"",
			sequence2:"",
			fiveprime2:"false"			
		});
	}

	sequencechecker(e, name )
	{
		let bases = e.split("");
		let checkpoint = true;
		for(let i = 0 ;i < bases.length;i++)
		{
			if( (bases[i] != "O") && 
				(bases[i] != "A") && 
				(bases[i] != "T") && 	
				(bases[i] != "C") && 
				(bases[i] != "G")){
				checkpoint = false;
			}
		}
		return checkpoint;
	}

	mismatchfunction()
	{
		if(this.state.sequence1 == "" || this.state.sequence2 == "" )
			Materialize.toast("Unfulfilled Requirement: Both strand sequences must have at least one base",3000);

		let seq1 = this.state.sequence1.replace(/[^a-zA-Z-]/g, '').toUpperCase();
		
		if(this.sequencechecker(seq1) == false)
			Materialize.toast("Unfulfilled Requirement: Sequence of strand 1  o A T C or G characters",3000);
		
		let seq2 = this.state.sequence2.replace(/[^a-zA-Z-]/g, '').toUpperCase();
		if(this.sequencechecker(seq2) == false)
			Materialize.toast("Unfulfilled Requirement: Sequence of strand 2 contains o A T C or G characters",3000);

		let strandlist = [this.state.name1,seq1,this.state.fiveprime1,this.state.name2,seq2,this.state.fiveprime2]
		StrandAction.CompareStrandsTA(strandlist);
	}


	loadcomparescreen()
	{
		let resultstyle = {
	  		overflow:"scroll",
	  		fontFamily:"'Share Tech Mono',serif", 
	  		whiteSpace:"pre",
	  		width:"1100px",
		}
		let bestarrangementstyle = {
    		background:"rgba(255,255,255,.7)",
    		height:"170px",
    		paddingBottom:"30px",
    	}
    	let allarrangementstyle = {
     		height:"678px",
     		overflow:"scroll",	
    	    background:"rgba(255,255,255,.5)",
    	}
    	let bestarrangementitemstyle = {
    		display: "inline-block",
    		marginLeft: "50%",
    		transform: "translate(-50%, 0%)",
    		marginTop:"20px"
    	}
    	let bestarrangementtitlestyle = {
    		fontSize:"15px",
			height:"55px",
			paddingTop:"13px",
			fontFamily:"'Share Tech Mono',serif",
			textAlign:"center"
		}
		if(!(this.state.output[1].length == 0))
		{
			let shiftedarrays = this.state.output[1][1].split("$$$");
			return  (
				<div style = {resultstyle}> 
					<div style = {bestarrangementstyle}>
						<div style = {bestarrangementtitlestyle}>
							Strongest Base Pairing Arrangement:  {this.state.output[0]}
						</div>
						<div style = {bestarrangementitemstyle}>
							{this.state.output[1][0]}
						</div>
					</div>

		 			<div style = {allarrangementstyle}>
						<Table className = "responsive-table striped">
					        <thead>
					          <tr>
					              <th data-field="id" style = {{paddingLeft:"30px"}}>All Arrangements</th>
					          </tr>
					        </thead>
						    <tbody>
								{shiftedarrays.map(function(listValue,index){	
										return (<tr key = {index} >
											      <td style = {{paddingLeft:"20px"}} >{listValue} </td>
											    </tr>)
								})}
				        	</tbody>
				      	</Table>
					</div>
				</div>
				)
		}
	}
	
	_handleKeyPress(input) 
	{
		if (input.key == 'Enter') 
		{
			this.mismatchfunction();
		}
	}

	loadbottom(){
		let bodyStyle = { 
			width:"1104px",
			margin:"0px 0px 15px 1px",
			padding:"0px 10px 10px 10px",
			backgroundColor:"#eceff1"
		}
		let labelStyle = {
			display:"inline-block",
			margin:"10px 0px 0px 20px",
			width:"500px",
			marginRight:"5px",
			verticalAlign:"top"
		}
			return (
				<div style = {bodyStyle}>
					<p style = {{color:"#9e9e9e",textAlign:"center"}}> [ Tip: Add 'o' as a non pairing base ] </p>
					<div style = {labelStyle}> 
						<Input
							label="Name (Default: A)" 
							type = "text" 
							 s={12}
							className = "validate"
							onChange = {this.handlename}
						/>

						<Input 					
							name="dnadirection" 		
							defaultChecked = {true}  
							value={1}  
							type="radio"
							label = "5' to 3'"
							onClick = {this.handleprime}
						/>
						<Input 					
							name="dnadirection" 		
							defaultChecked = {false}  
							value={2}  
							type="radio"
							label = "3' to 5'"
							onClick = {this.handleprime}
						/>
						<Input 					
							name="dnadirection" 		
							defaultChecked = {false}  
							value={3}  
							type="radio"
							label = "Loop DNA"
							onClick = {this.handleprime}
						/>			

						<Input
							s={12}
							value = {this.state.blueprint} 
							onKeyPress={this._handleKeyPress} 
							label="Strand Sequence (i.e.) ATCG"
							type = "text"
							onChange = {this.handleinput}
						/>
					</div>
					<div style = {labelStyle}> 
						<Input
							label="Name (Default: B)" 
							type = "text" 
							s={12}
							className = "validate"
							onChange = {this.handlename2}
						/>
						<Input 					
							name="dnadirection2" 		
							defaultChecked = {false}  
							value={4}  
							type="radio"
							label = "5' to 3'"
							onClick = {this.handleprime}
						/>
						<Input 					
							name="dnadirection2" 		
							defaultChecked = {true}  
							value={5}  
							type="radio"
							label = "3' to 5'"
							onClick = {this.handleprime}
						/>
						<Input 					
							name="dnadirection2" 		
							defaultChecked = {false}  
							value={6}  
							type="radio"
							label = "Loop DNA"
							onClick = {this.handleprime}
						/>					
						<Input
							s={12}
							value = {this.state.blueprint} 
							onKeyPress={this._handleKeyPress} 
							label="Strand Sequence (i.e.) ATCG"
							type = "text"
							onChange = {this.handleinput2}
						/>
					</div>	

					<Button style = {{marginLeft:"40px"}} onClick = {this.clear}> CLEAR</Button>
					<Button style = {{marginLeft:"20px"}} onClick = {this.mismatchfunction}> SUBMIT</Button>
				
					<div style = {{marginTop:"20px", height:"670px",background:"rgba(0,0,0,.15)",overflow:"hidden"}}> 
						{this.loadcomparescreen()} 
					</div>

				</div>)
	}
		
	render(){
		
		return(		 
			<div>				
				{this.loadbottom()}
			</div>
		);
	}
}