// @flow

import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import FullWidthSection from './FullWidthSection';
import typography from 'material-ui/styles/typography';
import {cyan500, grey200, grey900, lightWhite, darkWhite} from 'material-ui/styles/colors';
import transitions from 'material-ui/styles/transitions';

import ShowPicker from './ShowPicker';
import RaisedButton from 'material-ui/RaisedButton';

import CastList from './CastList';

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
                "name": "Test 1"
            },
            {
                "id": "y",
                "name": "Test 2"
            },
        ];
    };

    handleShowPickFinish = (show) => {
        this.setState({
            showShowPicker: false,
        });

        fetch("api/test", {
            accept: "application/json"
        }).then((response) => {
            return response.json();
        }).then((response) => {
            global.window.alert(response["message"]);
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

        // TODO Deal with smaller screen sizes
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

                    <CastList />

                    {this.footer()}
                </div>
            </MuiThemeProvider>
        );
    }
}

export default App;
