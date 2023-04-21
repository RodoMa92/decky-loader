import { Dropdown, Field } from 'decky-frontend-lib';
import { FunctionComponent } from 'react';
import { useTranslation } from 'react-i18next';

import Logger from '../../../../logger';
import { callUpdaterMethod } from '../../../../updater';
import { useSetting } from '../../../../utils/hooks/useSetting';

const logger = new Logger('BranchSelect');

enum UpdateBranch {
  Stable,
  Prerelease,
  // Testing,
}

const BranchSelect: FunctionComponent<{}> = () => {
  const { t } = useTranslation();
  const tStores = [
    t('StoreSelect.store_channel.default'),
    t('StoreSelect.store_channel.testing'),
    t('StoreSelect.store_channel.custom'),
  ];
  const [selectedBranch, setSelectedBranch] = useSetting<UpdateBranch>('branch', UpdateBranch.Prerelease);

  return (
    // Returns numerical values from 0 to 2 (with current branch setup as of 8/28/22)
    // 0 being stable, 1 being pre-release and 2 being nightly
    <Field label={t('BranchSelect.update_channel.label')} childrenContainerWidth={'fixed'}>
      <Dropdown
        rgOptions={Object.values(UpdateBranch)
          .filter((branch) => typeof branch == 'string')
          .map((branch) => ({
            label: tStores[UpdateBranch[branch]],
            data: UpdateBranch[branch],
          }))}
        selectedOption={selectedBranch}
        onChange={async (newVal) => {
          await setSelectedBranch(newVal.data);
          callUpdaterMethod('check_for_updates');
          logger.log('switching branches!');
        }}
      />
    </Field>
  );
};

export default BranchSelect;
