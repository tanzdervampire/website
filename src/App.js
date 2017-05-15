// @flow

import React, {Component} from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import FullWidthSection from './FullWidthSection';
import typography from 'material-ui/styles/typography';
import {cyan500, grey200, grey900, lightWhite, darkWhite} from 'material-ui/styles/colors';

import ShowPicker from './ShowPicker/ShowPicker';
import RaisedButton from 'material-ui/RaisedButton';

import './App.css';

import injectTapEventPlugin from 'react-tap-event-plugin';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
        };
    }

    handleShowPickFinish = (date, show) => {
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
                    Besetzungslisten »Tanz der Vampire«
                </h1>
                <h2 style={styles.h2}>
                    Finde schnell und unkompliziert heraus welcher Cast an einem bestimmten Tag gespielt hat.
                </h2>
                <RaisedButton
                    label="Cast finden"
                    style={styles.button}
                />
            </FullWidthSection>
        );
    }

    searchPanel() {
        const styles = {
            root: {
                backgroundColor: grey200
            }
        };

        return (
            <FullWidthSection useContent={true} style={styles.root}>
                <div style={{maxWidth: 500, margin: 'auto'}}>
                    <ShowPicker
                        onFinish={this.handleShowPickFinish}
                    />
                </div>
            </FullWidthSection>
        );
    }

    castList() {
        const styles = {
            content: {
                backgroundColor: lightWhite
            }
        };

        return (
            <div id="content-container" style={styles.content}>
                <p>Todo</p>
                <p>Todo</p>
                <p>Todo</p>
                <p>Todo</p>
                <p>Todo</p>
                <p>Todo</p>
                <p>Todo</p>
                <p>Todo</p>
                <p>Todo</p>
                <p>Todo</p>
                <p>Todo</p>
                <p>Todo</p>
            </div>
        );
    }

    footer() {
        const styles = {
            root: {
                backgroundColor: grey900,
                position: "relative",
                bottom: 0
            },
            p: {
                color: lightWhite,
                maxWidth: 500
            }
        };

        return (
            <FullWidthSection useContent={true} style={styles.root}>
                <p style={styles.p}>
                    This is the footer
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
