import React, { Component } from "react";
import { Button } from "react-bootstrap";
import "./Tutorial.css";
import Table from "react-bootstrap/Table";
import basicsprite from "./tutorialimages/basicsprite.png";
import charselect from "./tutorialimages/characterselect.png";
import HUD from "./tutorialimages/playerHud.png";
import status from "./tutorialimages/healthandmana.png";
import otherHealth from "./tutorialimages/playerhealt.png";
import rider from "./tutorialimages/riderclass.png";
import shooter from "./tutorialimages/shooter.png";
import useHUD from "./tutorialimages/usehud.gif";
import spriteMovement from './tutorialimages/movement.gif'
import spriteAttack from './tutorialimages/attack.gif'
import singlemainbuilding from './tutorialimages/mainbuilding.png' 
import gameover from './tutorialimages/gameover.png'
import lowcenter from './tutorialimages/lowhealthbuilding.png'
import lowhealth from './tutorialimages/lowhealth.png'
import building from './tutorialimages/building.png'
import spawn from './tutorialimages/spawn.png'
import stop  from './tutorialimages/stop.png'
import destroy  from './tutorialimages/destroy.png'
import reward  from './tutorialimages/reward.png'

/**
 * Tutorial class
 */
class Tutorial extends Component {
  /**
   * @param {integer} Counter want the page not to be static so counter just keeps track of what step in the page you are on
   */
  state = {
    Counter: 0
  };
  // <img src={status}/>


  /**
   *when we click(next), it execute this instruction to tell the page to move on to the next set of tutorial elements
   */
  inccount = () => {
    this.setState({
      Counter: this.state.Counter + 1
    });
  };
  /**
   * when we click(prev), it execute this instruction to tell the page to move on to the previous set of tutorial elements
   */
  deccounter = () => {
    this.setState({
      Counter: this.state.Counter - 1
    });
  };

  /**
   * standard react render method where all the aspects of the website can be displayed
   */
  render() {
    return (
      <div>
        {this.state.Counter === 0 && (
          <div>
            <h2> The aim of the game is survival</h2>
            <div className="filler"> </div>
            <div className="box">
              <Button className="prev" variant="btn btn-light">
                Previous{" "}
              </Button>
              <img src={basicsprite} alt='Character sprite'/>
              <Button className="next" onClick={this.inccount}>
                NEXT{" "}
              </Button>
            </div>
          </div>
        )}
        {this.state.Counter === 1 && (
          <div>
            <h2>Character Selection</h2>
            <div className="filler"> </div>
            <div className="box">
              <Button
                onClick={this.deccounter}
                className="prev"
                variant="btn btn-dark"
              >
                Previous{" "}
              </Button>
              <img src={charselect} alt='character selection'/>
              <Button className="next" onClick={this.inccount}>
                NEXT{" "}
              </Button>
              <h4>
                Choose You Character wisely
              </h4>
              <h2>class stats</h2>
              <Table align="center">
                <tr>
                  <th><h6>class name:</h6></th>
                  <th className="rider">
                    <h3>Rider Class</h3>
                  </th>
                  <th className="shooter">
                    <h3><h6>Shooter Class</h6></h3>
                  </th>
                </tr>
                <tr>
                  <th><h6>attack photo:</h6></th>
                  <th className="rider">
                    <img src={rider} alt='rider'/>
                  </th>
                  <th className="shooter">
                    <img src={shooter} alt='shooter'/>
                  </th>
                </tr>
                <tr>
                  <th><h6>attack description:</h6></th>
                  <th className="rider">
                    <h3>shoot out a sludge from behind</h3>
                  </th>
                  <th className="shooter">
                    <h3>shoot</h3>
                  </th>
                </tr>
                <tr>
                  <th><h6>Starting Health:</h6></th>
                  <th className="rider">
                    <h3>250</h3>
                  </th>
                  <th className="shooter">
                    <h3>250</h3>
                  </th>
                </tr>
                <tr>
                  <th><h6>Starting mana:</h6></th>
                  <th className="rider">
                    <h3>1000</h3>
                  </th>
                  <th className="shooter">
                    <h3>1000</h3>
                  </th>
                </tr>
                <tr>
                  <th><h6>Speed in single player:</h6></th>
                  <th className="rider">
                    <h3>110</h3>
                  </th>
                  <th className="shooter">
                    <h3>75</h3>
                  </th>
                </tr>
                <tr>
                  <th><h6>Speed in multiplayer player:</h6></th>
                  <th className="rider">
                    <h3>100</h3>
                  </th>
                  <th className="shooter">
                    <h3>64</h3>
                  </th>
                </tr>
              </Table>
            </div>
          </div>
        )}
        {this.state.Counter === 2 && (
          <div>
            <h2> Movement </h2>
            <div className="filler"> </div>
            <div className="box">
              <Button
                onClick={this.deccounter}
                className="prev"
                variant="btn btn-dark"
              >
                Previous{" "}
              </Button>
              <Button className="next" onClick={this.inccount}>
                NEXT{" "}
              </Button>
              <img src={spriteMovement} alt='character movement'/>
              <table>
                <th>
                  <tr><h3>A key to move left</h3></tr>
                </th>
                <th>
                  <tr><h3>W key to move up</h3></tr>
                </th>
                <th>
                  <tr><h3>D key to move right</h3></tr>
                </th>
                <th>
                  <tr><h3>S key to move down</h3></tr>
                </th>
              </table>
              <br />
              <img src={spriteAttack} alt='character attack'/>
              <table>
                <th>
                  <tr><h3>Space bar to attack</h3></tr>
                </th>
              </table>
            </div>
          </div>
        )}
        {this.state.Counter === 3 && (
          <div>
            <h2> Single Player Objective</h2>
            <div className="filler"> </div>
            <div className="box">
              <Button
                onClick={this.deccounter}
                className="prev"
                variant="btn btn-dark"
              >
                Previous{" "}
              </Button>
              <Button className="next" onClick={this.inccount}>
                NEXT{" "}
              </Button>
              <img src={singlemainbuilding} alt='single building'/>
              <h2>Defend the center building from attacking enemies</h2>
              <img src={status} alt='status'/>
              <h2>keep an eye on your health and manabar</h2>
              <img src={building} alt='building'/>
              <h2>destroy all other buildings to win the game</h2>
              <br />
              <div>
                <img src={lowcenter} alt='low center'/>
                <img src={lowhealth} alt='low health'/>
              </div>
              <br />
              <h2>you lose when you die and your center building dies</h2>
              <br />
              <img src={gameover} alt='game over'/>
            </div>
          </div>
        )}
        {this.state.Counter === 4 && (
          <div>
            <h2> Multiplayer Objective</h2>
            <div className="filler"> </div>
            <div className="box">
              <Button
                onClick={this.deccounter}
                className="prev"
                variant="btn btn-dark"
              >
                Previous{" "}
              </Button>
              <Button className="next" onClick={this.inccount}>
                NEXT{" "}
              </Button>
              <img src={spawn} alt='spawn'/>
              <h2>defend the building you spawn closest to</h2>
              <img src={status} alt='status'/>
              <h2>keep an eye on your health and manabar</h2>
              <br />
              <img src={lowhealth} alt='low health'/>        
                <h2>when you die there's a respawn cooldowntime</h2>
              <br />
              <h2>Gameover when building destroyed</h2>
              <br />
              <img src={gameover} alt='game over'/>
            </div>
          </div>
        )}
        {this.state.Counter === 5 && (
          <div>
            <h2> opposing health </h2>
            <div className="filler"> </div>
            <div className="box">
              <Button
                onClick={this.deccounter}
                className="prev"
                variant="btn btn-dark"
              >
                Previous{" "}
              </Button>
              <Button className="next" onClick={this.inccount}>
                NEXT{" "}
              </Button>
              <img src={otherHealth} alt='other players health'/>
              <h2>view opposing players health with the HUD on left</h2>
            </div>
          </div>
        )}
        {this.state.Counter === 6 && (
          <div>
            <h2> Drag and drop from your player HUD members</h2>
            <div className="box">
            <Button
                onClick={this.deccounter}
                className="prev"
                variant="btn btn-dark"
              >
                Previous{" "}
              </Button>
              <Button className="next" onClick={this.inccount}>
                NEXT{" "}
              </Button>
              <img id="Hud" src={useHUD} alt='HUD'/>
              <h3>Everytime one is placed, it reduced player mana</h3>
              <h2> Functionality of Units </h2>
              <img className="directHUD" src={HUD} alt='HUD'/>
              <Table className="directHUD" align="center">
                <tr>
                  <th><h4>robot</h4></th>
                  <th><h4>wolf</h4></th>
                  <th><h4>skeletor</h4></th>
                  <th><h4>demon</h4></th>
                  <th><h4>wall</h4></th>
                </tr>
                <tr>
                  <th><h5>attack nearby players and towers</h5></th>
                  <th><h5>attack nearby players and towers</h5></th>
                  <th><h5>attack nearby players and towers</h5></th>
                  <th><h5>attack nearby players and towers</h5></th>
                  <th><h5>Blocks players path and attacks</h5></th>
                </tr>
      
                <tr>
                  <th><h5>Low mana cost standard unit</h5></th>
                  <th><h5>Become werewolf and strengthen when health is low</h5></th>
                  <th><h5>Moderate Health Points, slow movement speed</h5></th>
                  <th><h5>Increase size and attack speed in low health</h5></th>
                  <th><h5>Nonmovable blocks that can be passed when destroyed </h5></th>
                </tr>
              </Table>
            </div>
          </div>
        )}
         {this.state.Counter === 7 && (
          <div>
            <h2>Ultimate Skills</h2>
            <div className="filler"> </div>
            <div className="box">
              <Button
                onClick={this.deccounter}
                className="prev"
                variant="btn btn-dark"
              >
                Previous{" "}
              </Button>
              <h2>Press Z key in Single player to petrify nearby enemies</h2>
              <img src={stop} alt='stop'/>
              <h2>Press E key to destroy all nearby enemies</h2>
              <br />
              <img src={destroy} alt='destory'/>        
              <h2>Destroy the center sword to earn the ultimate ability in multiplayer</h2>
              <img src={reward} alt='reward'/>  
              <br />
            </div>
          </div>
        )}
      </div>
    );
  }
}


export default Tutorial;