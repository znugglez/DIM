import React, { useEffect } from 'react';
import { UIView, UIViewInjectedProps } from '@uirouter/react';
import { getPlatforms } from './platforms';
import { DestinyAccount } from './destiny-account';
import { accountsSelector } from './reducer';
import { RootState } from 'app/store/reducers';
import { Loading } from 'app/dim-ui/Loading';
import { connect } from 'react-redux';

interface StoreProps {
  accounts: readonly DestinyAccount[];
}

function mapStateToProps(state: RootState): StoreProps {
  return {
    accounts: accountsSelector(state)
  };
}

type Props = StoreProps & UIViewInjectedProps;

function BungieAccount({ accounts }: Props) {
  useEffect(() => {
    getPlatforms();
  }, []);

  return accounts.length > 0 ? <UIView /> : <Loading />;
}

export default connect(mapStateToProps)(BungieAccount);
