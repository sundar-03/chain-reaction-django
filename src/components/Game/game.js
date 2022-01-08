import React from 'react';
import './game.css';
import axios from 'axios';
import {Redirect} from 'react-router-dom'; 
const Grid = require("../../js/grid");

export default class Games extends React.Component {
    constructor()
    {
        super();
        this.state = {
            "grid" : new Grid(4,4),
            "playerTurn" : true,
            "aiTurn" : false,
            "isGamewon": false,
            "currentPlayer" : "User",
            "playerColor": "Red",
            "aiColour" : "Blue",
            "gameIdentifier" : "",
            "error": false,
            "lock" : false,
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle = () => {
        //if this is player turn, flip to ai turn
        if(this.state.playerTurn)
        {
            this.setState({
                "playerTurn" : false,
                "aiTurn" : true,
            });
        }
        //else this is ai turn, flip to player turn
        else
        {
            this.setState({
                "playerTurn" : true,
                "aiTurn" : false,
            });
        }
    };


    onCellClick = (id) => {
        let i = parseInt(id[1]), j = parseInt(id[3]);
        
        //if this is player turn
        if(this.state.playerTurn && !this.state.lock)
        {
            //if the cell clicked containes orbs
            if(this.state.grid.returnCountofCell(i,j) !== 0)
            {
                //check the colour

                //if the colour is not equal
                if(this.state.grid.returnColourofCell(i, j) !== this.state.playerColor)
                {
                    alert("You cannot place on opponents cell");
                }
                else
                {
                    //contains orbs with correct colour
                    //lock and progress
                    this.setState({
                        "lock" : true,
                    });
                //add count
                const output = this.state.grid.handleClick(i, j, this.state.playerColor);

                //display image
                    document.getElementById(id).src = "assests/images/" + output.path;

                //animatiom
                    var status = [false, null];
                    if(output.animationStatus)
                    {
                        console.log({
                            "animation input i" : i,
                            "animation input j" : j,
                        });
                        status = this.state.grid.handleAnimation(i, j);
                        
                    }

                    //if game finished
                    if(status[0])
                    {
                        
                        if(status[1] === "Red")
                        {
                            //player won case
                            const temp = {
                                "x" : i.toString(),
                                "y": j.toString(),
                                "whichPlayer" : "player",
                                "gameIdentifier" : this.state.gameIdentifier, 
                                "playerWon" : true
                            };
                            axios.post("http://localhost:8000/api/move/", temp, {
                                headers : {
                                    'content-type' : 'application/json',
                                }
                            }).then((res) => {
                                console.log(res.data);
                                if(res.data.success)
                                {
                                    alert("Thank you for playing");
                                    this.setState(
                                        {
                                            "error" : true,
                                            "isGamewon": true,
                                        }
                                    );
                                }
                                else
                                {
                                    alert(res.data.message);
                                    this.setState({
                                        "error" : true,
                                    });
                                }
                            }).catch((error) => {
                                alert("Error");
                                this.setState({
                                    "error" : true,
                                 });
                            });

                        }
                        else 
                        {
                            //error case, by movement of player, ai cannot win
                            alert("error showing ai won for player move");
                            this.setState({
                                "error" : true,
                             });
                        }

                    }
                    else
                    {
                        //flip turn 
                        this.toggle();
                        this.setState({
                            "currentPlayer" : "AI"
                        });
                
                        //call ai and get the move
                        const temp = {
                            "x" : i.toString(),
                            "y": j.toString(),
                            "whichPlayer" : "player",
                            "gameIdentifier" : this.state.gameIdentifier, 
                            "playerWon" : false
                        };
                        axios.post("http://localhost:8000/api/move/", temp, {
                            headers : {
                                'content-type' : 'application/json',
                            }
                        }).then((res) => {
                            console.log(res.data);
                            if(res.data.success)
                            {
                                const x = res.data.x;
                                const y = res.data.y;
                                const aiId = "r" + x.toString() + "c" + y.toString();
                                var status;
                                //make the move
                                const output = this.state.grid.handleClick(x,y, this.state.aiColour);


                                document.getElementById(aiId).src = "assests/images/" + output.path;
                        
                                //do animation
                                if(output.animationStatus)
                                {
                                    status = this.state.grid.handleAnimation(x, y);
                                    
                                }
        
                                //if ai finished the game, redirect
                                if(res.data.AIwon)
                                {
                                    if(!status[0])
                                    {
                                        alert("Error at animation");
                                    }
                                    else
                                    {
                                        if(status[1] === "Red")
                                        {
                                            alert("Error error at second parameter of animation");
                                        }
                                        else
                                        {
                                            alert("Thank you for playing the game");
                                            this.setState({
                                                "error" : true,
                                                "isGamewon": false,
                                            });
                                        }
                                    }
                                }
                                //else toggle it and unlock it
                                else
                                {
                                    this.toggle();
                                    this.setState({
                                        "currentPlayer" : "User"
                                    });
                                    this.setState({
                                        "lock" : false,
                                    });
                                }
                            }
                            else
                            {
                                alert(res.data.message);
                                this.setState({
                                    "error" : true,
                                });
                            }
                        }).catch((error) => {
                            alert("Error");
                            this.setState({
                                "error" : true,
                            });
                        });
                    }
                }
            }
            //cell has no orbs
            else
            {
                this.setState({
                    "lock" : true
                });
                const output = this.state.grid.handleClick(i,j, this.state.playerColor);
                document.getElementById(id).src = "assests/images/" + output.path;

                //flip turn 
                this.toggle();
                this.setState({
                    "currentPlayer" : "AI"
                });
        
                //call ai and get the move
                const temp = {
                    "x" : i.toString(),
                    "y": j.toString(),
                    "whichPlayer" : "player",
                    "gameIdentifier" : this.state.gameIdentifier, 
                    "playerWon" : false
                };
                axios.post("http://localhost:8000/api/move/", temp, {
                    headers : {
                        'content-type' : 'application/json',
                    }
                }).then((res) => {
                    console.log(res.data);
                    if(res.data.success)
                    {
                        const x = res.data.x;
                        const y = res.data.y;
                        const aiId = "r" + x.toString() + "c" + y.toString();
                        var status;

                        //make the move
                        const output = this.state.grid.handleClick(x,y, this.state.aiColour);


                        document.getElementById(aiId).src = "assests/images/" + output.path;

                        //do animation
                        if(output.animationStatus)
                        {
                            status = this.state.grid.handleAnimation(x, y);
                        }

                        //if ai finished the game, redirect
                        if(res.data.AIwon)
                        {
                            if(!status[0])
                            {
                                alert("Error at animation");
                            }
                            else
                            {
                                if(status[1] === "Red")
                                {
                                    alert("Error error at second parameter of animation");
                                }
                                else
                                {
                                    alert("Thank you for playing the game");
                                    this.setState({
                                        "error" : true,
                                        "isGamewon": false,
                                    });
                                }
                            }
                        }
                        //else toggle it and unlock it
                        else
                        {
                            this.toggle();
                            this.setState({
                                "currentPlayer" : "User"
                            });
                            this.setState({
                                "lock" : false,
                            });
                        }
                    }
                    else
                    {
                        alert(res.data.message);
                        this.setState({
                            "error" : true,
                        });
                    }
                }).catch((error) => {
                    alert("Error");
                    this.setState({
                        "error" : true,
                    });
                });
            }
        }
        else
        {
            alert("Please wait till AI plays or animation finishes");
        }
    };

    componentDidMount()
    {

        let images = document.getElementsByTagName("img");
        let i = 0;
        for(i = 0; i < images.length; i++)
        {
            images[i].style.width = ((window.innerWidth/ 10) - 2) + "px";
            images[i].style.height = (((7 *window.innerHeight)/ 90) - 2) + "px";
            images[i].style.padding = "1px";
        }
        
        axios.get("http://localhost:8000/api/createRoom/").then((res) => {
            console.log(res.data);
            if(res.data.success)
            {
                this.setState({
                    "gameIdentifier": res.data.data.gameIdentifier,
                });
            }
            else
            {
                alert("prechana");
                this.setState({
                    "error" : true,
                });
            }
        }).catch((error) => {
            alert("Error problem occured");

        });

    }

    
    render()
    {
        if(this.state.error)
        return <Redirect to="/" />
       
        return (
            <div id="wholecontainer">
                <div id = "heading">
                    <p>
                         <b> 
                             <i>
                                 Chain Reaction
                            </i>
                        </b >
                    </p>
                    <p>
                         <b> 
                             <i>
                                 Current Player: {this.state.currentPlayer}
                                 <br />
                            </i>
                        </b >
                    </p>
                </div>
                <div id="table">
                    <div id="row0">
                       <img src="assests/images/noApproach/count0/default.jpg" alt="Loading...." id="r0c0" onClick={ () => this.onCellClick("r0c0")}/>
                       <img src="assests/images/noApproach/count0/default.jpg" alt="Loading...." id="r0c1" onClick={ () => this.onCellClick("r0c1")}/>
                       <img src="assests/images/noApproach/count0/default.jpg" alt="Loading...." id="r0c2" onClick={ () => this.onCellClick("r0c2")}/>
                       <img src="assests/images/noApproach/count0/default.jpg" alt="Loading...." id="r0c3" onClick={ () => this.onCellClick("r0c3")}/>
                    </div>
                    <div id="row1">
                       <img src="assests/images/noApproach/count0/default.jpg" alt="Loading...." id="r1c0" onClick={ () => this.onCellClick("r1c0")}/>
                       <img src="assests/images/noApproach/count0/default.jpg" alt="Loading...." id="r1c1" onClick={ () => this.onCellClick("r1c1")}/>
                       <img src="assests/images/noApproach/count0/default.jpg" alt="Loading...." id="r1c2" onClick={ () => this.onCellClick("r1c2")}/>
                       <img src="assests/images/noApproach/count0/default.jpg" alt="Loading...." id="r1c3" onClick={ () => this.onCellClick("r1c3")}/>
                    </div>
                    <div id="row2">
                       <img src="assests/images/noApproach/count0/default.jpg" alt="Loading...." id="r2c0" onClick={ () => this.onCellClick("r2c0")}/>
                       <img src="assests/images/noApproach/count0/default.jpg" alt="Loading...." id="r2c1" onClick={ () => this.onCellClick("r2c1")}/>
                       <img src="assests/images/noApproach/count0/default.jpg" alt="Loading...." id="r2c2" onClick={ () => this.onCellClick("r2c2")}/>
                       <img src="assests/images/noApproach/count0/default.jpg" alt="Loading...." id="r2c3" onClick={ () => this.onCellClick("r2c3")}/>
                    </div>
                    <div id="row3">
                       <img src="assests/images/noApproach/count0/default.jpg" alt="Loading...." id="r3c0" onClick={ () => this.onCellClick("r3c0")}/>
                       <img src="assests/images/noApproach/count0/default.jpg" alt="Loading...." id="r3c1" onClick={ () => this.onCellClick("r3c1")}/>
                       <img src="assests/images/noApproach/count0/default.jpg" alt="Loading...." id="r3c2" onClick={ () => this.onCellClick("r3c2")}/>
                       <img src="assests/images/noApproach/count0/default.jpg" alt="Loading...." id="r3c3" onClick={ () => this.onCellClick("r3c3")}/>
                       </div>
                </div>
            </div>
            );
    }
};