package data

import "testing"

func TestResourceGovernanceUpdate(t *testing.T) {
	ClosePostgres()
	resourceGovernanceState.Lock()
	resourceGovernanceState.items = map[string]ResourceGovernanceRecord{}
	resourceGovernanceState.Unlock()

	items := ResourceGovernanceData("P1")
	if len(items) != 4 {
		t.Fatalf("expected 4 P1 resources, got %d", len(items))
	}
	required := false
	saved, err := UpdateResourceGovernance(ResourceGovernanceUpdateRequest{
		ID: "P1-R04", Usage: "用于填写可复核的现场证据记录。", LinkedSection: "exercise", Required: &required,
		Completeness: "通过", Availability: "可用", VisualStatus: "通过", UpdatedBy: "张老师",
	})
	if err != nil {
		t.Fatalf("update resource: %v", err)
	}
	if saved.Completeness != "通过" || saved.VisualStatus != "通过" || saved.LinkedSection != "exercise" || saved.Required || saved.UpdatedAt == 0 {
		t.Fatalf("unexpected saved resource: %#v", saved)
	}
	again := ResourceGovernanceData("P1")
	if again[3].Completeness != "通过" {
		t.Fatalf("memory update was not returned: %#v", again[3])
	}
	if _, err := UpdateResourceGovernance(ResourceGovernanceUpdateRequest{
		ID: "P1-R04", Completeness: "未知", Availability: "可用", VisualStatus: "通过",
	}); err == nil {
		t.Fatal("expected invalid status error")
	}
	if _, err := UpdateResourceGovernance(ResourceGovernanceUpdateRequest{
		ID: "P1-R04", Completeness: "通过", Availability: "可用", VisualStatus: "通过", LinkedSection: "unknown",
	}); err == nil {
		t.Fatal("expected invalid linked section error")
	}
}
