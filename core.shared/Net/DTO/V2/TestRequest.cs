using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Core.Shared.Net.DTO.V2
{
    public class TestRequest
    {
        public string? Id { get; set; } = null;
        public string? Name { get; set; } = null;
    }
}
