import { push } from 'connected-react-router';
import qs from 'qs';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { filter, from, mergeMap, tap } from 'rxjs';
import { ApplicationContext } from '../../contexts';
import { ProductSuggestion } from '../../models/catalog';
import SearchInput from './SearchInput';

interface SearchInputManagementProps {
  visible: boolean;
  onClose: () => void;
}

export function SearchInputManagement({
  visible,
  onClose,
}: SearchInputManagementProps): ReactElement {
  const { catalogService } = useContext(ApplicationContext);
  const dispatch = useDispatch();

  const [fetching, setFetching] = useState(false);
  const [options, setOptions] = useState<Array<any>>([]);
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);

  useEffect(() => {
    setOptions(() =>
      suggestions.map(({ category, products }) => ({
        label: renderCategory(category),
        options: products.map(({ id, name }) => renderProduct(id, name)),
      }))
    );
  }, [suggestions]);

  const onSearchTermChange = (textSearch: string) => {
    // TODO: debounce calling api action
    from(textSearch)
      .pipe(
        filter(() => !!textSearch && textSearch !== ''),
        tap(() => setFetching(true)),
        mergeMap(() =>
          catalogService!
            .fetchProductSuggestions(textSearch)
            .pipe(tap(setSuggestions))
        )
      )
      .subscribe({
        error: () => setFetching(false),
        complete: () => setFetching(false),
      });
  };

  const onChange = (option: string) => {
    setSelectedOption(option);
  };

  const onCompleteClick = () => {
    if (!selectedOption || selectedOption.trim() === '') return;
    const query = { name: selectedOption };
    dispatch(push(`/products?${qs.stringify(query)}`));
    onClose();
  };

  const renderCategory = (category: string) => <span>{category}</span>;

  const renderProduct = (id: UniqueId, name: string) => ({
    value: name,
    key: id,
    label: (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        {name}
      </div>
    ),
  });

  return (
    <SearchInput
      options={options}
      visible={visible}
      fetching={fetching}
      onChange={onChange}
      onSearch={onSearchTermChange}
      onCompleteClick={onCompleteClick}
    />
  );
}
