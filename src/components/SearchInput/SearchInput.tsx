import * as React from 'react'
import { connect } from 'react-redux'
import { compose, withHandlers, withStateHandlers, pure } from 'recompose'

import { frontPageActions } from 'redux/modules'

import styles from './SearchInput.scss'

type RedState = {
  filterValue: string
  isActive: boolean
}

type WithState = {
  myRef: any
}

type WithStateHandlers = {
  setRef: () => WithState
  blurRef: () => WithState
}

type WithHandlers = {
  onKeyUpHandlers: (e: any) => void
  onInputChange: (e: any) => void
}

type DispatchProps = {
  filter: (s: string) => void
  setIsActive: (b: boolean) => void
}

type CombinedProps = RedState & WithState & WithStateHandlers & WithHandlers

const mapStateToProps: (x: any) => RedState = ({ frontPage }: any) => ({
  filterValue: frontPage.filterValue,
  isActive: frontPage.isActive
})

const mapDispatchToProps = {
  filter: frontPageActions.filter,
  setIsActive: frontPageActions.setIsActive
}

export const SearchInputInner: React.SFC<CombinedProps> = ({
  filterValue, onInputChange, onKeyUpHandlers, setRef
}) => (
  <input
    type="text"
    ref={setRef}
    value={filterValue}
    onChange={onInputChange}
    className={styles.root}
    placeholder="Search"
    onKeyUp={onKeyUpHandlers}
  />
)

const SearchInput = compose<CombinedProps, {}>(
  connect(mapStateToProps, mapDispatchToProps),
  pure,
  withStateHandlers<WithState, WithStateHandlers, RedState>(
    { myRef: null },
    {
      setRef: () => ref => ({ myRef: ref }),
      blurRef: ({ myRef }) => () => myRef.blur()
    }
  ),
  withHandlers<DispatchProps & WithState & WithStateHandlers & RedState, WithHandlers>({
    onKeyUpHandlers: ({ blurRef }) => (e: any) => {
      if (e.keyCode === 13) {
        blurRef()
      }
    },
    onInputChange: ({ filter, setIsActive }) => (e: any) => {
      setIsActive(e.target.value !== '')
      filter(e.target.value)
    }
  })
)(SearchInputInner)

export default SearchInput
