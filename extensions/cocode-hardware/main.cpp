#include <iostream>
#include <string>
#include <thread>
#include <chrono>
#include <fstream>
#include <sstream>

#ifdef _WIN32
#include <windows.h>
#else
#include <sys/sysinfo.h>
#endif

using namespace std;

string getMemoryInfo() {
    #ifdef _WIN32
        MEMORYSTATUSEX status;
        status.dwLength = sizeof(status);
        GlobalMemoryStatusEx(&status);
        return to_string(status.ullTotalPhys / 1024 / 1024);
    #else
        struct sysinfo info;
        if (sysinfo(&info) == 0) {
            return to_string(info.totalram * info.mem_unit / 1024 / 1024);
        }
        return "0";
    #endif
}

int main() {
    string line;
    // La comunicación con Neutralino se hace vía STDIN/STDOUT
    while (getline(cin, line)) {
        if (line == "getMemory") {
            cout << "{\"event\": \"memoryInfo\", \"data\": \"" << getMemoryInfo() << " MB\"}" << endl;
        } else if (line == "ping") {
            cout << "{\"event\": \"pong\", \"data\": \"C++ Bridge Active\"}" << endl;
        } else if (line == "exit") {
            break;
        }
    }
    return 0;
}
