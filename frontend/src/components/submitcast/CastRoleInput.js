// @flow

import React from 'react';
import PropTypes from 'prop-types';

import { Card, CardHeader, CardText, CardActions } from 'material-ui/Card';
import Chip from 'material-ui/Chip';
import FlatButton from 'material-ui/FlatButton';
import FastForward from 'material-ui/svg-icons/av/fast-forward';
import Done from 'material-ui/svg-icons/action/done';

import CastRoleAutoComplete from './CastRoleAutoComplete';

const rolesWithMultipleActors = [
    'Tanzsolisten',
    'Gesangssolisten',
    'Tanzensemble',
    'Gesangsensemble',
];

const maleRoles = [
    'Graf von Krolock',
    'Professor Abronsius',
    'Alfred',
    'Chagal',
    'Herbert',
    'Koukol',
];

class CastRoleInput extends React.Component {

    static propTypes = {
        role: PropTypes.string.isRequired,
        dataSource: PropTypes.array.isRequired,
        onFinish: PropTypes.func.isRequired,
        cardStyle: PropTypes.object,
    };

    static defaultProps = {
        cardStyle: {},
    };

    state = {
        actors: [],
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.role !== nextProps.role) {
            this.setState({ actors: [] });
        }
    };

    doesAllowMultipleActors() {
        const { role } = this.props;
        return rolesWithMultipleActors.includes(role);
    };

    getFilteredDataSource() {
        const { dataSource } = this.props;
        const { actors } = this.state;

        const alreadyListedNames = actors.map(person => person.name);
        return dataSource.filter(person => !alreadyListedNames.includes(person.name));
    };

    toChipKey(person) {
        const { role } = this.props;
        return `chip-${role}-${person.id}`;
    };

    fireOnFinish = () => {
        const { actors } = this.state;
        this.props.onFinish(actors);
    };

    handleAutoCompletion = person => {
        if (this.doesAllowMultipleActors()) {
            this.setState({actors: this.state.actors.concat(person)});
        } else {
            this.setState({actors: [person]});
        }
    };

    handleUpdate = (searchText, dataSource, params) => {
        if (!this.doesAllowMultipleActors()) {
            this.setState({actors: []});
        }
    };

    handleRemoveChip = key => {
        const {actors} = this.state;
        const filtered = actors.filter(actor => this.toChipKey(actor) !== key);
        this.setState({ actors: filtered });
        // TODO FIXME Focus input again
    };

    getHeaderSubtitle() {
        if (this.doesAllowMultipleActors()) {
            return 'Welche DarstellerInnen haben diese Rolle gespielt?';
        }

        if (maleRoles.includes(this.props.role)) {
            return 'Welcher Darsteller hat diese Rolle gespielt?';
        }

        return 'Welche Darstellerin hat diese Rolle gespielt?';
    };

    renderHeader() {
        const { role } = this.props;

        return (
            <CardHeader
                title={role}
                subtitle={this.getHeaderSubtitle()}
                expandable={false}
            />
        );
    };

    renderChips() {
        const { actors } = this.state;

        if (actors.length === 0 || !this.doesAllowMultipleActors()) {
            return (
                <div />
            );
        }

        const chips = actors.map(actor => {
            const key = this.toChipKey(actor);
            return (
                <Chip
                    key={key}
                    onRequestDelete={() => this.handleRemoveChip(key)}
                >
                    {actor.name}
                </Chip>
            );
        });

        const style = {
            display: 'flex',
            flexWrap: 'wrap',
            marginTop: '1em',
        };

        return (
            <div style={style}>
                {chips}
            </div>
        );
    };

    renderActions() {
        const isSkip = this.state.actors.length === 0;
        const label = isSkip
            ? 'Überspringen'
            : 'Weiter';

        const icon = isSkip
            ? (<FastForward />)
            : (<Done />);

        return (
            <CardActions>
                <FlatButton
                    label={label}
                    onTouchTap={this.fireOnFinish}
                    icon={icon}
                />
            </CardActions>
        );
    };

    render() {
        const { role, cardStyle } = this.props;

        return (
            <Card style={cardStyle}>
                {this.renderHeader()}

                <CardText>
                    <CastRoleAutoComplete
                        role={role}
                        allowsMultipleEntries={this.doesAllowMultipleActors()}
                        dataSource={this.getFilteredDataSource()}
                        onSubmit={this.handleAutoCompletion}
                        onUpdate={this.handleUpdate}
                    />

                    {this.renderChips()}
                </CardText>

                {this.renderActions()}
            </Card>
        );
    };

}

export default CastRoleInput;