import { RadioChangeEvent } from 'antd';
import { replace } from 'connected-react-router';
import qs from 'qs';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { mergeMap, of, tap } from 'rxjs';
import { ApplicationContext } from '../../../contexts';
import {
  currencyActions,
  currencyUnitSelector,
} from '../../currency/currencySlice';
import { ProductFilter } from './ProductFilter';

interface ProductFilterManagementProps {
  visible: boolean;
  onClose: () => void;
}

export function ProductFilterManagement({
  visible,
  onClose,
}: ProductFilterManagementProps): ReactElement {
  const dispatch = useDispatch();
  const currencyUnit = useSelector(currencyUnitSelector);

  const { search } = useLocation();

  const { currencyService } = useContext(ApplicationContext);

  const [fetchingSupportedCurrencyList, setFetchingSupportedCurrencyList] =
    useState(false);
  const [supportedCurrencyList, setSupportedCurrencyList] = useState<
    Array<string>
  >([]);
  const [conditions, setConditions] = useState({
    sort: 'name',
    order: 'asc',
    unit: currencyUnit,
  });

  useEffect(() => {
    const fetchList$ = of(true)
      .pipe(
        tap(() => setFetchingSupportedCurrencyList(true)),
        mergeMap(() =>
          currencyService!
            .getSupportedList()
            .pipe(tap((currencyList) => setSupportedCurrencyList(currencyList)))
        )
      )
      .subscribe({
        error: () => setFetchingSupportedCurrencyList(false),
        complete: () => setFetchingSupportedCurrencyList(false),
      });

    return () => fetchList$.unsubscribe();
  }, [currencyService]);

  const onApplyClick = () => {
    // TODO: build up with the old and new conditions
    const currentConditions = qs.parse(search, { ignoreQueryPrefix: true });
    dispatch(
      replace(
        `/products?${qs.stringify({ ...currentConditions, ...conditions })}`
      )
    );

    // close the product filter
    onClose();
  };

  const onConditionsChange = (event: RadioChangeEvent) => {
    setConditions((prev) => ({
      ...prev,
      [event.target.name!]: event.target.value,
    }));
  };

  const onCurrencyChange = (currency: string) => {
    dispatch(currencyActions.setUnit(currency));
    setConditions((prev) => ({ ...prev, unit: currency }));
  };

  const onClearClick = () => {
    setConditions((prev) => ({
      ...prev,
      sort: 'name',
      order: 'asc',
      unit: currencyUnit,
    }));
  };

  return (
    <ProductFilter
      visible={visible}
      onClose={onClose}
      conditions={conditions}
      fetchingSupportedCurrencyList={fetchingSupportedCurrencyList}
      supportedCurrencyList={supportedCurrencyList}
      onClearClick={onClearClick}
      onApplyClick={onApplyClick}
      onCurrencyChange={onCurrencyChange}
      onConditionsChange={onConditionsChange}
    />
  );
}
