Sequel.migration do
  change do
    alter_table(:view_tabs) do
      add_column :download, TrueClass, default: false
    end

    # Run through all of the tabs and set them to false.
    self[:view_tabs].all do |view_tab|
      self[:view_tabs].where(id: view_tab[:id]).update(download: false)
    end

    alter_table(:view_panes) do
      add_column :download, TrueClass, default: false
    end

    # Run through all of the panes and set them to false.
    self[:view_panes].all do |view_pane|
      self[:view_panes].where(id: view_pane[:id]).update(download: false)
    end

    alter_table(:view_attributes) do
      add_column :download, TrueClass, default: false
    end

    # Run through all of the attributes and set them to false.
    self[:view_attributes].all do |view_attribute|
      self[:view_attributes]
        .where(id: view_attribute[:id])
        .update(download: false)
    end
  end
end
