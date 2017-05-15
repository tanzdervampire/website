// @flow

import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import FullWidthSection from './FullWidthSection';
import typography from 'material-ui/styles/typography';
import {cyan500, grey200, grey900, lightWhite, darkWhite} from 'material-ui/styles/colors';
import transitions from 'material-ui/styles/transitions';

import ShowPicker from './ShowPicker/ShowPicker';
import RaisedButton from 'material-ui/RaisedButton';

import Paper from 'material-ui/Paper';
import Avatar from 'material-ui/Avatar';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';
import Divider from 'material-ui/Divider';
import {Toolbar, ToolbarGroup, ToolbarTitle} from 'material-ui/Toolbar';

import IconButton from 'material-ui/IconButton';
import KeyboardArrowLeft from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import KeyboardArrowRight from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

import './App.css';

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {

    state = {
        showShowPicker: false
    };

    handleSearchCast = () => {
        const {showShowPicker} = this.state;

        this.setState({
            showShowPicker: !showShowPicker,
        });
    };

    providePossibleShows = (date) => {
        return [
            {
                "id": "x",
                "name": "Test"
            },
        ];
    };

    handleShowPickFinish = (show) => {
        this.setState({
            showShowPicker: false,
        });

        // TODO Handle this
    };

    introductionPanel() {
        const styles = {
            root: {
                backgroundColor: cyan500,
                textAlign: 'center',
                overflow: 'hidden'
            },
            h1: {
                color: darkWhite,
                fontWeight: typography.fontWeightLight,
                fontSize: 56,
            },
            h2: {
                fontSize: 24,
                letterSpacing: 0,
            },
            button: {
                margin: '32px 32px 0px 0px',
            },
        };

        styles.h2 = Object.assign({}, styles.h1, styles.h2);

        return (
            <FullWidthSection useContent={true} style={styles.root}>
                <h1 style={styles.h1}>
                    Besetzungslisten für Tanz der Vampire
                </h1>
                <h2 style={styles.h2}>
                    Finde schnell und unkompliziert die Besetzung für eine Vorstellung.
                </h2>
                <RaisedButton
                    label="Besetzung finden"
                    style={styles.button}
                    onTouchTap={this.handleSearchCast}
                />
            </FullWidthSection>
        );
    }

    searchPanel() {
        const { showShowPicker } = this.state;

        // TOOD Revisit animation and check Material UI's "Show source" mechanism out.
        const styles = {
            root: {
                backgroundColor: grey200,
            },
            container: {
                transition: transitions.easeOut("1000ms", ["max-height"]),
                maxHeight: showShowPicker ? 500 : 0,
                overflow: "hidden",
            }
        };

        return (
            <div style={styles.container}>
                <FullWidthSection useContent={true} style={styles.root}>
                    <div style={{maxWidth: 500, margin: 'auto'}}>
                        <ShowPicker
                            onDateSelected={this.providePossibleShows}
                            onFinish={this.handleShowPickFinish}
                        />
                    </div>
                </FullWidthSection>
            </div>
        );
    }

    castList() {
        const styles = {
            content: {
                backgroundColor: lightWhite
            },
            header: {
                padding: 10,
                marginBottom: 10,
            },
            listContainer: {
                maxWidth: 500,
                textAlign: "left",
                position: "relative",
                margin: "0 auto",
            },
        };

        return (
            <div id="content-container" style={styles.content}>
                <div style={styles.listContainer}>
                    <Paper>
                        <Toolbar>
                            <ToolbarGroup>
                                <IconButton>
                                    <KeyboardArrowLeft />
                                </IconButton>
                            </ToolbarGroup>
                            <ToolbarGroup>
                                <ToolbarTitle text="20.05.2017, Matinée, Stuttgart" />
                            </ToolbarGroup>
                            <ToolbarGroup>
                                <IconButton>
                                    <KeyboardArrowRight />
                                </IconButton>
                            </ToolbarGroup>
                        </Toolbar>
                        <List>
                            <Subheader>Hauptrollen</Subheader>
                            <ListItem
                                disabled={true}
                                primaryText="Jan Amann"
                                secondaryText="Graf von Krolock"
                                leftAvatar={<Avatar src="images/avatar.jpg" />}
                            />
                            <ListItem
                                disabled={true}
                                primaryText="Aris Sas"
                                secondaryText="Alfred"
                                leftAvatar={<Avatar src="images/avatar.jpg" />}
                            />
                            <ListItem
                                disabled={true}
                                primaryText="Victor Petersen"
                                secondaryText="Professor Abronsius"
                                leftAvatar={<Avatar src="images/avatar.jpg" />}
                            />
                            <ListItem
                                disabled={true}
                                primaryText="Veronica Appeddu"
                                secondaryText="Sarah"
                                leftAvatar={<Avatar src="images/avatar.jpg" />}
                            />
                            <ListItem
                                disabled={true}
                                primaryText="Nicolas Tenerani"
                                secondaryText="Chagal"
                                leftAvatar={<Avatar src="images/avatar.jpg" />}
                            />
                            <ListItem
                                disabled={true}
                                primaryText="Franziska Forster"
                                secondaryText="Magda"
                                leftAvatar={<Avatar src="images/avatar.jpg" />}
                            />
                            <ListItem
                                disabled={true}
                                primaryText="Simone Pohl"
                                secondaryText="Rebecca"
                                leftAvatar={<Avatar src="images/avatar.jpg" />}
                            />
                            <ListItem
                                disabled={true}
                                primaryText="Milan van Waardenburg"
                                secondaryText="Herbert"
                                leftAvatar={<Avatar src="images/avatar.jpg" />}
                            />
                            <ListItem
                                disabled={true}
                                primaryText="Paolo Bianca"
                                secondaryText="Koukol"
                                leftAvatar={<Avatar src="images/avatar.jpg" />}
                            />
                            <Divider />
                            <Subheader>Tanzensemble</Subheader>
                            <ListItem
                                disabled={true}
                                primaryText="Max Mustermann"
                                leftAvatar={<Avatar src="images/avatar.jpg" />}
                            />
                            <ListItem
                                disabled={true}
                                primaryText="Max Mustermann"
                                leftAvatar={<Avatar src="images/avatar.jpg" />}
                            />
                            <ListItem
                                disabled={true}
                                primaryText="Max Mustermann"
                                leftAvatar={<Avatar src="images/avatar.jpg" />}
                            />
                        </List>
                    </Paper>
                </div>
            </div>
        );
    }

    footer() {
        const styles = {
            root: {
                backgroundColor: grey900,
                position: "relative",
                bottom: 0,
                textAlign: "center"
            },
            p: {
                color: lightWhite,
            }
        };

        return (
            <FullWidthSection useContent={true} style={styles.root}>
                <p style={styles.p}>
                    Created by Ingo Bürk, 2017.
                </p>
            </FullWidthSection>
        );
    }

    render() {
        return (
            <MuiThemeProvider>
                <div id="app-container">
                    {this.introductionPanel()}
                    {this.searchPanel()}
                    {this.castList()}
                    {this.footer()}
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
