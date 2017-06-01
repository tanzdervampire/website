// @flow

import React from 'react';
import PropTypes from 'prop-types';
import levenshtein from 'fast-levenshtein';
import { grey400 } from 'material-ui/styles/colors';

import AutoComplete from 'material-ui/AutoComplete';

class CastRoleAutoComplete extends React.Component {

    static propTypes = {
        role: PropTypes.string.isRequired,
        allowsMultipleEntries: PropTypes.bool.isRequired,
        dataSource: PropTypes.array.isRequired,
        onSubmit: PropTypes.func.isRequired,
        onUpdate: PropTypes.func,
    };

    static defaultProps = {
        onUpdate: () => {},
    };

    state = {
        userInput: '',
        errorText: null,
    };

    componentWillReceiveProps(nextProps) {
        if (this.props.role !== nextProps.role) {
            this.setState({
                userInput: '',
                errorText: null,
            });
        }
    };

    handleUpdate = (searchText, dataSource, params) => {
        this.setState({
            userInput: searchText,
            errorText: null,
        });

        this.props.onUpdate(searchText, dataSource, params);
    };

    handleNewRequest = (name, index) => {
        const { allowsMultipleEntries } = this.props;

        // TODO FIXME Look up name in data source in case it was entered manually (but correctly)
        // TODO FIXME Allow entering new names.
        // Note that this requires a few changes to, e.g., the key used for chips etc.
        if (index === -1) {
            this.setState({ errorText: 'Nur bereits bekannte Darsteller dürfen eingegeben werden!' });
            return;
        }

        if (allowsMultipleEntries) {
            this.setState({ userInput: '' });
        }

        this.props.onSubmit(name);
        if (this.input) {
            this.input.focus();
        }
    };

    /**
     * Lowercases the input and removes all diacritics.
     */
    normalize(str) {
        return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    };

    filter = (rawSearchText, rawKey) => {
        const searchText = this.normalize(rawSearchText);
        const key = this.normalize(rawKey);

        /* For a direct substring match, we immediately allow it. */
        if (key.includes(searchText)) {
            return true;
        }

        /* Fall back to Levenshtein */
        return searchText.length >= 3 && levenshtein.get(searchText, key) <= 3;
    };

    render() {
        const { dataSource } = this.props;

        const styles = {
            root: {
                textAlign: 'center',
            },
            floating: {
                color: grey400,
            },
            underline: {
                borderColor: grey400,
            },
        };

        return (
            <div id="cast-role-field" style={styles.root}>
                <AutoComplete
                    name="currentRoleInput"
                    floatingLabelText="Name des Darstellers"
                    floatingLabelStyle={styles.floating}
                    underlineStyle={styles.underline}
                    underlineFocusStyle={styles.underline}
                    errorText={this.state.errorText}
                    dataSource={dataSource}
                    dataSourceConfig={{ text: 'name', value: 'id' }}
                    onNewRequest={this.handleNewRequest}
                    onUpdateInput={this.handleUpdate}
                    filter={this.filter}
                    searchText={this.state.userInput}
                    maxSearchResults={5}
                    ref={(input) => { this.input = input; }}
                />
            </div>
        );
    };

}

export default CastRoleAutoComplete;