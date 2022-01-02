import {
  Button,
  Col,
  Drawer,
  Radio,
  RadioChangeEvent,
  Row,
  Select,
  Typography,
} from 'antd';
import { CloseCircleFilled } from '@ant-design/icons';
import React, { ReactElement } from 'react';
import { generateKeyForArray } from '../../../utils';
import { orderByOptions, sortByOptions } from '../../../constants';

interface ProductFilterProps {
  visible: boolean;

  fetchingSupportedCurrencyList: boolean;
  supportedCurrencyList: Array<string>;
  conditions: {
    sort: string;
    order: string;
    unit: string;
  };

  onClose: () => void;
  onClearClick: () => void;
  onApplyClick: () => void;
  onCurrencyChange: (currency: string) => void;
  onConditionsChange: (event: RadioChangeEvent) => void;
}

export function ProductFilter({
  visible,
  onClose,
  conditions,
  supportedCurrencyList,
  fetchingSupportedCurrencyList,
  onClearClick,
  onApplyClick,
  onCurrencyChange,
  onConditionsChange,
}: ProductFilterProps): ReactElement {
  return (
    <Drawer
      visible={visible}
      placement="bottom"
      height="100%"
      onClose={onClose}
      closeIcon={<CloseCircleFilled style={{ fontSize: '1.5rem' }} />}
      extra={
        <Row gutter={4}>
          <Col xs={12}>
            <Button
              style={{ borderColor: 'black', color: 'black' }}
              onClick={onClearClick}
            >
              Clear
            </Button>
          </Col>
          <Col xs={12}>
            <Button
              type="primary"
              style={{
                backgroundColor: 'black',
                outline: 'none',
                borderColor: 'black',
              }}
              onClick={onApplyClick}
            >
              Apply
            </Button>
          </Col>
        </Row>
      }
    >
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} xl={8}>
          <Typography.Title level={2}>Sort By</Typography.Title>
          <Radio.Group
            onChange={onConditionsChange}
            value={conditions.sort}
            name="sort"
          >
            <Row gutter={[16, 16]}>
              {sortByOptions.map(({ value, label }, index) => (
                <Col xs={24} key={generateKeyForArray(index)}>
                  <Radio value={value}>{label}</Radio>
                </Col>
              ))}
            </Row>
          </Radio.Group>
        </Col>

        <Col xs={24} md={12} xl={8}>
          <Typography.Title level={2}>Order By</Typography.Title>
          <Radio.Group
            onChange={onConditionsChange}
            value={conditions.order}
            name="order"
          >
            <Row gutter={[16, 16]}>
              {orderByOptions.map(({ value, label }, index) => (
                <Col xs={24} key={generateKeyForArray(index)}>
                  <Radio value={value}>{label}</Radio>
                </Col>
              ))}
            </Row>
          </Radio.Group>
        </Col>

        <Col xs={24} xl={8}>
          <Typography.Title level={2}>Currencies</Typography.Title>
          <Select
            showSearch
            placeholder="Select a preferable currency"
            defaultValue={conditions.unit}
            onChange={onCurrencyChange}
            style={{ width: '100%' }}
            loading={fetchingSupportedCurrencyList}
          >
            {supportedCurrencyList.map((currency, index) => (
              <Select.Option
                value={currency.toLocaleLowerCase()}
                key={generateKeyForArray(index)}
              >
                {currency.toLocaleUpperCase()}
              </Select.Option>
            ))}
          </Select>
        </Col>
      </Row>
    </Drawer>
  );
}
