using Core.Shared.Net.Enumerations;

namespace Core.Shared.Net.DTO
{
    public class TestRequest
    {
        public string? Id { get; set; } = null;
        public string? Name { get; set; } = null;
        public MyEnum Value { get; set; }
    }
}
