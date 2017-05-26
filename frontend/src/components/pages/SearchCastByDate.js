// @flow

import React from 'react';
import typography from 'material-ui/styles/typography';
import { red500, grey50 } from 'material-ui/styles/colors';

import FullWidthSection from '../../FullWidthSection';
import ShowPicker from '../showpicker/ShowPicker';
import CastList from '../castlist/CastList';

class SearchCastByDate extends React.Component {

    state = {
        currentShow: null,
    };

    onShowSelected = (show) => {
        this.setState({ currentShow: show });
    };

    header() {
        const styles = {
            root: {
                textAlign: 'center',
                backgroundColor: red500,
                overflow: 'hidden',
            },
            h1: {
                color: grey50,
                fontWeight: typography.fontWeightLight,
                fontSize: 48,
            },
            h2: {
                fontSize: 24,
            },
        };

        styles.h2 = Object.assign({}, styles.h1, styles.h2);

        return (
            <FullWidthSection style={styles.root}>
                <h1 style={styles.h1}>
                    Tanz der Vampire
                </h1>
                <h2 style={styles.h2}>
                    Castlisten
                </h2>
            </FullWidthSection>
        );
    };

    search() {
        const styles = {
            root: {
                textAlign: 'center',
                backgroundColor: grey50,
                overflow: 'hidden',
            },
        };

        return (
            <FullWidthSection style={styles.root}>
                <ShowPicker
                    onChange={this.onShowSelected}
                />
            </FullWidthSection>
        );
    };

    content() {
        const { currentShow } = this.state;

        const styles = {
            root: {
                backgroundColor: grey50,
                overflow: 'hidden',
                textAlign: 'center',
            },
        };

        return (
            <div style={styles.root}>
                <CastList
                    show={currentShow}
                />
            </div>
        );
    };

    render() {
        return (
            <div>
                {this.header()}
                {this.search()}
                {this.content()}
            </div>
        );
    };

}

export default SearchCastByDate;