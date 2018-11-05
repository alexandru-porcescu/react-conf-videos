import * as React from 'react'
import { connect } from 'react-redux'
import { compose, pure, withHandlers } from 'recompose'

import { routingActions } from 'redux/modules'

import {
  List,
  Meta,
  Header,
  SearchInput,
  ResultDetails,
  InnerLayoutContainer
} from 'components'

import { IndexedConferences } from '../../../domain'

type ReduxProps = {
  conferences: IndexedConferences,
  filterValue: string
}

type DispatchpProps = {
  navigateToSearchURL: typeof routingActions.navigateToSearchURL
}

type WithHandlers = {
  onInputChange: (e: any) => void
}

type Props = ReduxProps & DispatchpProps & WithHandlers

export const FrontPageInner: React.SFC<Props> = (props) => (
  <div>
    <Meta title={props.filterValue} />
    <Header />
    <InnerLayoutContainer>
      <SearchInput
        filterValue={props.filterValue}
        onChange={props.onInputChange}
      />

      <ResultDetails conferences={props.conferences} />
      <List conferences={props.conferences} />
    </InnerLayoutContainer>
  </div>
)

const mapStateToProps = ({search: {conferences, filterValue}}: any) => ({
  filterValue,
  conferences
})

const dispatchMap = ({
  navigateToSearchURL: routingActions.navigateToSearchURL
})

const FrontPage = compose<Props, {}>(
  connect(mapStateToProps, dispatchMap),
  pure,
  withHandlers<ReduxProps & DispatchpProps, WithHandlers>({
    onInputChange: ({navigateToSearchURL}) => (e: any) => {
      navigateToSearchURL(e.target.value)
    }
  })
)(FrontPageInner)

export default FrontPage
