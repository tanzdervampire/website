// @flow

import React from 'react';
import moment from 'moment';
import { red500, grey50 } from 'material-ui/styles/colors';

import Snackbar from 'material-ui/Snackbar';
import CircularProgress from 'material-ui/CircularProgress';
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import { Card, CardHeader, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import DoneAll from 'material-ui/svg-icons/action/done-all';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';

import CastRoleInput from '../submitcast/CastRoleInput';
import ShowInput from '../submitcast/ShowInput';
import CastList from '../castlist/CastList';
import ShowPickerItem from '../showpicker/ShowPickerItem';

const Roles = [
    'Graf von Krolock',
    'Sarah',
    'Alfred',
    'Professor Abronsius',
    'Chagal',
    'Magda',
    'Herbert',
    'Rebecca',
    'Koukol',
    'Tanzsolisten',
    'Gesangssolisten',
    'Tanzensemble',
    'Gesangsensemble',
    'Dirigent',
];

const Step = {
    GENERAL: 1,
    CAST: 2,
    CHECK: 3,
};

function getStyles() {
    return {
        root: {
            maxWidth: 400,
            margin: '0 auto',
            paddingTop: '2em',
            paddingBottom: '2em',
            textAlign: 'left',
        },
        card: {
            textAlign: 'left',
            marginBottom: '2em',
        },
    };
}

class EnterCast extends React.Component {

    state = {
        currentRole: Roles[0],
        actors: {},
        fetchFailed: false,

        selectedDate: null,
        selectedTime: null,
        selectedLocation: null,
        cast: {},

        step: Step.GENERAL,
        snackbarOpen: false,
        snackbarMessage: '',
    };

    componentDidMount() {
        this.loadActors();
    };

    loadActors() {
        fetch(`/api/actors`, {
            accept: 'application/json',
        }).then(response => {
            if (!response.ok) {
                throw new Error();
            }

            return response.json();
        }).then(actors => {
            const mapped = Object.keys(actors).map(name => {
                return {
                    name,
                    id: actors[name].id,
                };
            });

            this.setState({ actors: mapped });
        }).catch(err => {
            console.log(`Failed to load actors!`);
            this.setState({ fetchFailed: true });
        });
    };

    convertToShowType(time) {
        if (!time) {
            return null;
        }

        return (+time.format('H')) < 18 ? 'Matinée' : 'Soirée';
    };

    convertToShow() {
        const { selectedDate, selectedTime, selectedLocation, cast } = this.state;
        const time = moment(selectedTime);

        return {
            day: moment(selectedDate).format('YYYY-MM-DD'),
            time: time.format('HH:mm'),
            type: this.convertToShowType(time),
            location: selectedLocation.location,
            theater: selectedLocation.theater,
            cast: Object.assign({}, cast),
        };
    };

    handleShowInputFinish = (selectedDate, selectedTime, selectedLocation) => {
        const { step } = this.state;
        this.setState({
            selectedDate,
            selectedTime,
            selectedLocation,
            step: Math.max(step, Step.CAST),
        });
    };

    handleSubmitShow = () => {
        let show = this.convertToShow();

        /* Remove the person IDs since they might change, so we shouldn't have them in the submitted data. */
        Object.keys(show.cast).forEach(role => {
            show.cast[role] = show.cast[role].map(obj => obj.name);
        });

        const data = JSON.stringify(show);
        fetch('/api/shows', {
            method: 'POST',
            accept: 'application/json',
            headers: new Headers({
                'Content-Type': 'application/json',
                'content-type': 'application/json',
            }),
            body: data,
        }).then(response => {
            if (!response.ok) {
                throw new Error();
            }

            return response.json();
        }).then(response => {
            this.setState({
                snackbarOpen: true,
                snackbarMessage: 'Die Castliste wurde erfolgreich eingereicht!',
            });
        }).catch(err => {
            this.setState({
                snackbarOpen: true,
                snackbarMessage: 'Beim Versenden gab es einen Fehler!',
            });
        });
    };

    handleSnackbarClose = () => {
        this.setState({ snackbarOpen: false });
        this.props.history.push('/');
    };

    transitionToNextRole() {
        const { currentRole, step } = this.state;
        const currentIndex = Roles.indexOf(currentRole);

        /* There's a next role, so transition and be done with it. */
        if (currentIndex < Roles.length - 1) {
            this.setState({ currentRole: Roles[currentIndex + 1] });
            return;
        }

        /* We've reached the end! */
        this.setState({ step: Math.max(step, Step.CHECK) });
    };

    handleCastRoleInputFinish = actors => {
        const { currentRole, cast } = this.state;

        this.setState({ cast: Object.assign({}, cast, { [currentRole]: actors }) });
        this.transitionToNextRole();
    };

    renderShowPickerItem() {
        const show = this.convertToShow();
        return (
            <Paper>
                <ShowPickerItem
                    show={show}
                    selected={true}
                    displayDate={true}
                    onShowSelected={() => {}}
                />
            </Paper>
        );
    };

    renderShowData() {
        const { step } = this.state;
        if (step !== Step.GENERAL) {
            return null;
        }

        const styles = getStyles();
        return (
            <ShowInput
                onFinish={this.handleShowInputFinish}
                cardStyle={styles.card}
            />
        );
    };

    renderCast() {
        const { currentRole, actors, fetchFailed, step } = this.state;
        if (step !== Step.CAST) {
            return null;
        }

        const styles = getStyles();
        return (
            <div>
                {this.renderShowPickerItem()}

                { fetchFailed && (
                    <p>Ups! Leider gab es ein Problem.</p>
                ) }
                { !fetchFailed && actors.length === 0 && (
                    <CircularProgress color={red500} />
                ) }
                { actors.length !== 0 && (
                    <CastRoleInput
                        role={currentRole}
                        dataSource={actors}
                        onFinish={this.handleCastRoleInputFinish}
                        cardStyle={styles.card}
                    />
                ) }
            </div>
        );
    };

    renderCheck() {
        const { step } = this.state;
        if (step !== Step.CHECK) {
            return null;
        }

        const show = this.convertToShow();
        const styles = getStyles();
        return (
            <div>
                <Card style={styles.card}>
                    <CardHeader
                        title="Danke!"
                        subtitle="Nur noch ein letzter Schritt…"
                        expandable={false}
                        avatar={<Avatar color={grey50} backgroundColor={red500} icon={<ThumbUp />} />}
                    />

                    <CardText>
                        <p>Überprüfe die eingegebene Castliste bitte nochmals auf Korrektheit.</p>
                        <p>Bitte beachte auch, dass jede Einreichung manuell geprüft wird und daher einige Stunden oder Tage vergehen können bis die Vorstellung einsehbar ist.</p>
                        <p />
                        <p>Vielen Dank!</p>
                    </CardText>
                </Card>

                {this.renderShowPickerItem()}

                <CastList
                    show={show}
                    missingMainCastName=""
                />

                <div style={{ textAlign: 'center' }}>
                    <RaisedButton
                        label="Fertig"
                        icon={<DoneAll />}
                        primary={true}
                        onTouchTap={this.handleSubmitShow}
                        disabled={this.state.snackbarOpen}
                    />
                </div>
            </div>
        );
    };

    render() {
        const styles = getStyles();
        return (
            <div style={styles.root}>
                {this.renderShowData()}
                {this.renderCast()}
                {this.renderCheck()}

                <Snackbar
                    open={this.state.snackbarOpen}
                    message={this.state.snackbarMessage}
                    autoHideDuration={3000}
                    onRequestClose={this.handleSnackbarClose}
                />
            </div>
        );
    };

}

export default EnterCast;